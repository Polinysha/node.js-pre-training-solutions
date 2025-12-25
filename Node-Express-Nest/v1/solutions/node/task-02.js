const fs = require("fs");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const path = require("path");

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headers = null;
    this.lineNumber = 0;
    this.buffer = '';
    this.delimiter = options.delimiter || ',';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      this.lineNumber++;
      if (line.trim() === '') continue;

      if (this.lineNumber === 1) {
        this.headers = line.split(this.delimiter).map(h => h.trim());
      } else {
        const values = line.split(this.delimiter).map(v => v.trim());
        const record = {};
        
        for (let i = 0; i < this.headers.length; i++) {
          record[this.headers[i]] = i < values.length ? values[i] : '';
        }
        
        this.push(record);
      }
    }

    callback();
  }

  _flush(callback) {
    if (this.buffer.trim() !== '' && this.headers) {
      const values = this.buffer.split(this.delimiter).map(v => v.trim());
      const record = {};
      
      for (let i = 0; i < this.headers.length; i++) {
        record[this.headers[i]] = i < values.length ? values[i] : '';
      }
      
      this.push(record);
    }
    callback();
  }
}

class DataTransformer extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
  }

  _transform(record, encoding, callback) {
    const transformed = {
      name: capitalizeName(record.name || ''),
      email: normalizeEmail(record.email || ''),
      phone: formatPhone(record.phone || ''),
      birthdate: standardizeDate(record.birthdate || ''),
      city: capitalizeName(record.city || '')
    };

    this.push(transformed);
    callback();
  }
}

class CSVWriter extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    this.headerWritten = false;
    this.headers = ['name', 'email', 'phone', 'birthdate', 'city'];
    this.delimiter = options.delimiter || ',';
  }

  _transform(record, encoding, callback) {
    if (!this.headerWritten) {
      this.push(this.headers.join(this.delimiter) + '\n');
      this.headerWritten = true;
    }

    const line = this.headers
      .map(header => {
        const value = record[header] || '';
        if (value.includes(this.delimiter) || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(this.delimiter);

    this.push(line + '\n');
    callback();
  }
}

function capitalizeName(name) {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part =>
      part
        .split('-')
        .map(subPart =>
          subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase()
        )
        .join('-')
    )
    .join(' ');
}

function normalizeEmail(email) {
  if (!email) return '';
  
  const normalized = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(normalized) ? normalized : email;
}

function formatPhone(phone) {
  if (!phone) return 'INVALID';
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    const areaCode = digits.substring(0, 3);
    const prefix = digits.substring(3, 6);
    const lineNumber = digits.substring(6, 10);
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }
  
  return 'INVALID';
}

function standardizeDate(date) {
  if (!date || typeof date !== 'string') return '';
  
  const trimmedDate = date.trim();
  if (trimmedDate === '') return '';
  
  let year, month, day;
  
  if (trimmedDate.includes('/')) {
    const parts = trimmedDate.split('/');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        [year, month, day] = parts;
      } else if (parts[2].length === 4) {
        [month, day, year] = parts;
      } else if (parts[2].length === 2) {
        [month, day, year] = parts;
        if (year.length === 2) {
          year = parseInt(year, 10) > 50 ? '19' + year : '20' + year;
        }
      }
    }
  } else if (trimmedDate.includes('-')) {
    const parts = trimmedDate.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        [year, month, day] = parts;
      } else if (parts[2].length === 4) {
        [day, month, year] = parts;
      }
    }
  } else {
    return trimmedDate;
  }
  
  if (!year || !month || !day) {
    return trimmedDate;
  }
  
  if (year.length === 2) {
    year = parseInt(year, 10) > 50 ? '19' + year : '20' + year;
  }
  
  month = month.padStart(2, '0');
  day = day.padStart(2, '0');
  
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return trimmedDate;
  }
  
  return `${year}-${month}-${day}`;
}

async function processCSVFile(inputPath, outputPath) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(inputPath)) {
        throw new Error(`Input file not found: ${inputPath}`);
      }
      
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const readStream = fs.createReadStream(inputPath, { 
        encoding: 'utf8',
        highWaterMark: 64 * 1024
      });
      
      const writeStream = fs.createWriteStream(outputPath, { 
        encoding: 'utf8'
      });
      
      readStream.on('error', (error) => {
        reject(new Error(`Failed to read input file: ${error.message}`));
      });
      
      writeStream.on('error', (error) => {
        reject(new Error(`Failed to write output file: ${error.message}`));
      });
      
      await pipeline(
        readStream,
        new CSVParser(),
        new DataTransformer(),
        new CSVWriter(),
        writeStream
      );
      
      resolve();
      
    } catch (error) {
      reject(new Error(`Failed to process CSV file: ${error.message}`));
    }
  });
}

function createSampleData() {
  const dataDir = path.join(__dirname, 'data');
  
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const sampleData = `name,email,phone,birthdate,city
john doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york
jane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles
bob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago
alice brown,alice.brown@company.org,9876543210,1988/07/04,houston`;
    
    const inputPath = path.join(dataDir, 'users.csv');
    fs.writeFileSync(inputPath, sampleData, 'utf8');
    
    return inputPath;
    
  } catch (error) {
    throw new Error(`Failed to create sample data: ${error.message}`);
  }
}

module.exports = {
  CSVParser,
  DataTransformer,
  CSVWriter,
  processCSVFile,
  capitalizeName,
  normalizeEmail,
  formatPhone,
  standardizeDate,
  createSampleData,
};

if (require.main === module) {
  (async () => {
    try {
      const inputPath = createSampleData();
      const outputPath = path.join(path.dirname(inputPath), 'users_transformed.csv');
      
      await processCSVFile(inputPath, outputPath);
      
      const output = fs.readFileSync(outputPath, 'utf8');
      console.log(output);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}
