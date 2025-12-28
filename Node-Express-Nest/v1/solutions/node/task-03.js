const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const util = require("util");

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {
  // Реализуем анализ event loop
  const analysis = {
    phases: [
      "timers",
      "pending callbacks", 
      "idle, prepare",
      "poll",
      "check",
      "close callbacks"
    ],
    executionOrder: [
      "1. Synchronous code executes first",
      "2. process.nextTick microtasks execute",
      "3. Promise microtasks execute",
      "4. Timers phase (setTimeout, setInterval)",
      "5. Pending callbacks phase",
      "6. Idle, prepare phase (internal)",
      "7. Poll phase (I/O operations)",
      "8. Check phase (setImmediate)",
      "9. Close callbacks phase"
    ],
    explanations: [
      "Microtasks (nextTick, Promises) have priority over macrotasks",
      "Inside I/O callbacks, setImmediate executes before setTimeout",
      "The event loop processes phases in a specific order each iteration"
    ],
    snippet1Analysis: {
      order: [
        "Start",
        "End", 
        "Next Tick 1",
        "Next Tick 2",
        "Promise 1",
        "Promise 2",
        "Timer 1 or Immediate 1 (order may vary)",
        "Timer 2 or Immediate 2",
        "Immediate 1 or Timer 1",
        "Immediate 2 or Timer 2"
      ],
      explanation: "Synchronous code → nextTick → Promises → Macrotasks (timers/immediate)"
    },
    snippet2Analysis: {
      order: [
        "=== Start ===",
        "=== End ===",
        "NextTick",
        "Nested NextTick", 
        "Timer or Immediate (outside I/O)",
        "NextTick in Timer/Immediate",
        "Immediate or Timer",
        "NextTick in Immediate/Timer",
        "fs.readFile",
        "NextTick in readFile",
        "Immediate in readFile",
        "Timer in readFile"
      ],
      explanation: "Inside I/O callbacks, setImmediate has priority over setTimeout"
    }
  };

  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  const predictions = {
    snippet1: [
      "Start - synchronous console.log executes immediately",
      "End - synchronous console.log executes immediately",
      "Next Tick 1 - process.nextTick has highest priority among microtasks",
      "Next Tick 2 - process.nextTick microtask queue continues",
      "Promise 1 - Promise.then microtask executes after nextTick queue",
      "Promise 2 - Promise.then microtask continues",
      "Timer 1 or Immediate 1 - macrotasks execute after microtasks (order varies)",
      "Timer 2 or Immediate 2 - remaining macrotasks continue",
      "Immediate 1 or Timer 1 - final macrotasks complete execution",
      "Immediate 2 or Timer 2 - all tasks completed"
    ],
    snippet2: [
      "=== Start === - synchronous code executes first",
      "=== End === - synchronous code completes",
      "NextTick - process.nextTick microtask (highest priority)",
      "Nested NextTick - nextTick inside nextTick (still microtask)",
      "Timer or Immediate - macrotasks outside I/O (execution order may vary)",
      "NextTick in Timer/Immediate - microtask inside macrotask callback",
      "Immediate or Timer - remaining macrotask executes",
      "NextTick in Immediate/Timer - microtask inside macrotask callback",
      "fs.readFile - I/O callback executes when file read completes (poll phase)",
      "NextTick in readFile - microtask inside I/O callback",
      "Immediate in readFile - setImmediate inside I/O callback (executes immediately)",
      "Timer in readFile - setTimeout inside I/O callback (executes after immediate)"
    ]
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  const files = ["file1.txt", "file2.txt", "file3.txt"];
  const results = [];

  try {
    // Используем Promise.all для параллельного чтения с сохранением порядка
    const promises = files.map((file, index) => 
      fsPromises.readFile(file, "utf8")
        .then(content => {
          results[index] = content.toUpperCase();
          return { index, content: results[index] };
        })
        .catch(async (error) => {
          // Если файла нет - создаем его
          const defaultContent = `Content of ${file}`;
          await fsPromises.writeFile(file, defaultContent);
          results[index] = defaultContent.toUpperCase();
          return { index, content: results[index] };
        })
    );

    await Promise.all(promises);
    console.log("All files processed:", results);
    return results;

  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
  try {
    const userFile = `user-${userId}.json`;
    const prefFile = `preferences-${userId}.json`;
    const activityFile = `activity-${userId}.json`;
    const outputFile = `processed-${userId}.json`;

    // Проверяем существование файлов
    await Promise.all([
      fsPromises.access(userFile).catch(() => {
        throw new Error(`User file ${userFile} does not exist`);
      }),
      fsPromises.access(prefFile).catch(() => {
        throw new Error(`Preferences file ${prefFile} does not exist`);
      }),
      fsPromises.access(activityFile).catch(() => {
        throw new Error(`Activity file ${activityFile} does not exist`);
      })
    ]);

    // Читаем все файлы параллельно
    const [userDataStr, prefDataStr, activityDataStr] = await Promise.all([
      fsPromises.readFile(userFile, "utf8"),
      fsPromises.readFile(prefFile, "utf8"),
      fsPromises.readFile(activityFile, "utf8")
    ]);

    // Парсим JSON с обработкой ошибок
    let user, preferences, activity;
    try {
      user = JSON.parse(userDataStr);
    } catch (error) {
      throw new Error(`Invalid JSON in ${userFile}: ${error.message}`);
    }

    try {
      preferences = JSON.parse(prefDataStr);
    } catch (error) {
      throw new Error(`Invalid JSON in ${prefFile}: ${error.message}`);
    }

    try {
      activity = JSON.parse(activityDataStr);
    } catch (error) {
      throw new Error(`Invalid JSON in ${activityFile}: ${error.message}`);
    }

    // Объединяем данные
    const combinedData = {
      user,
      preferences,
      activity,
      processedAt: new Date().toISOString()
    };

    // Записываем результат
    await fsPromises.writeFile(
      outputFile,
      JSON.stringify(combinedData, null, 2),
      "utf8"
    );

    return combinedData;

  } catch (error) {
    throw new Error(`Failed to process user data: ${error.message}`);
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  try {
    console.log("Starting data processing...");

    // Читаем файл с использованием промисов
    const data = await fsPromises.readFile("input.txt", "utf8");
    console.log("File read successfully");

    // Обрабатываем данные
    const processedData = data.toUpperCase();

    // Записываем файл с использованием промисов
    await fsPromises.writeFile("output.txt", processedData, "utf8");
    console.log("File written successfully");

    // Проверяем запись
    const verifyData = await fsPromises.readFile("output.txt", "utf8");
    console.log("Verification successful");
    console.log("Data length:", verifyData.length);

  } catch (error) {
    console.error("Error during processing:", error.message);

    // Если файла input.txt не существует - создаем его
    if (error.code === 'ENOENT' && error.path === 'input.txt') {
      try {
        await fsPromises.writeFile("input.txt", "Hello World!", "utf8");
        console.log("Created input file, please run again");
      } catch (writeError) {
        console.error("Could not create input file:", writeError.message);
      }
    }
  }
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */
async function demonstrateEventLoop() {
  console.log("\n=== Event Loop Phase Demonstration ===\n");

  // 1. Синхронный код
  console.log("1. Synchronous code executes immediately");
  
  // 2. Microtasks
  process.nextTick(() => {
    console.log("2. process.nextTick - highest priority microtask");
  });

  Promise.resolve().then(() => {
    console.log("3. Promise.then - microtask after nextTick");
  });

  // 3. Timers phase
  setTimeout(() => {
    console.log("4. setTimeout - timers phase (min delay 1ms)");
  }, 1);

  // 4. Check phase (setImmediate)
  setImmediate(() => {
    console.log("5. setImmediate - check phase");
  });

  // 5. Poll phase (I/O operations)
  fs.readFile(__filename, "utf8", (err, data) => {
    if (!err) {
      console.log("6. fs.readFile - I/O callback in poll phase");
      
      // Внутри I/O коллбэка
      setImmediate(() => {
        console.log("7. setImmediate inside I/O - executes immediately");
      });

      setTimeout(() => {
        console.log("8. setTimeout inside I/O - executes after immediate");
      }, 0);
    }
  });

  // Ждем завершения всех операций
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log("\n=== Demonstration Complete ===");
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  const testData = {
    "user-123.json": JSON.stringify({
      id: 123,
      name: "John Doe",
      email: "john@example.com",
    }, null, 2),
    "preferences-123.json": JSON.stringify({
      theme: "dark",
      language: "en",
      notifications: true,
    }, null, 2),
    "activity-123.json": JSON.stringify({
      lastLogin: "2026-01-01",
      sessionsCount: 42,
      totalTime: 3600,
    }, null, 2),
    "input.txt": "Hello World! This is test data for processing.",
    "file1.txt": "Content of file 1",
    "file2.txt": "Content of file 2",
    "file3.txt": "Content of file 3",
  };

  try {
    // Создаем все файлы параллельно
    const writePromises = Object.entries(testData).map(([filename, content]) =>
      fsPromises.writeFile(filename, content, "utf8")
    );

    await Promise.all(writePromises);
    console.log("Test files created successfully");
  } catch (error) {
    console.error("Failed to create test files:", error.message);
  }
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = "unknown") {
  const timestamp = new Date().toISOString();
  const colors = {
    timers: "\x1b[33m",     // желтый
    poll: "\x1b[36m",       // голубой
    check: "\x1b[32m",      // зеленый
    close: "\x1b[31m",      // красный
    microtask: "\x1b[35m",  // пурпурный
    synchronous: "\x1b[37m", // белый
    unknown: "\x1b[90m"     // серый
  };

  const color = colors[phase] || colors.unknown;
  const reset = "\x1b[0m";
  
  console.log(`${color}[${timestamp.slice(11, 23)} | ${phase}]${reset} ${message}`);
}

// Экспорт функций
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Запуск примеров если файл запущен напрямую
if (require.main === module) {
  async function runExamples() {
    console.log(" Starting Event Loop Analysis Examples...\n");

    // Создаем тестовые файлы
    await createTestFiles();

    // Демонстрируем Event Loop
    console.log("\n=== Event Loop Demonstration ===");
    await demonstrateEventLoop();

    // Анализируем порядок выполнения
    console.log("\n=== Execution Order Analysis ===");
    const analysis = analyzeEventLoop();
    console.log("Event Loop Phases:", analysis.phases);
    console.log("\nExecution Order:", analysis.executionOrder);

    // Предсказываем порядок для сниппетов
    console.log("\n=== Snippet 1 Predictions ===");
    const pred1 = predictExecutionOrder("snippet1");
    pred1.forEach((p, i) => console.log(`${i + 1}. ${p}`));

    console.log("\n=== Snippet 2 Predictions ===");
    const pred2 = predictExecutionOrder("snippet2");
    pred2.forEach((p, i) => console.log(`${i + 1}. ${p}`));

    // Исправляем баги
    console.log("\n=== Fixing Broken Code ===");
    try {
      const raceResults = await fixRaceCondition();
      console.log(" Race condition fixed:", raceResults);

      const userData = await fixCallbackHell(123);
      console.log(" Callback hell converted:", userData.user.name);

      await fixMixedAsync();
      console.log(" Mixed async resolved");

      // Демонстрация logWithPhase
      console.log("\n=== Logging with Phases ===");
      logWithPhase("Synchronous message", "synchronous");
      logWithPhase("Timer callback", "timers");
      logWithPhase("I/O operation", "poll");
      logWithPhase("Immediate callback", "check");
      logWithPhase("Promise resolution", "microtask");

    } catch (error) {
      console.error(" Error fixing code:", error.message);
    }
  }

  runExamples().catch(console.error);
}
