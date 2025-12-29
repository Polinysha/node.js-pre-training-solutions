Git Branching Process Visualization
===================================

Initial: main
    |
    |--- feature/add-scripts
    |        |
    |        |--- Add scripts to package.json
    |        |
    |--- feature/add-dependencies
    |        |
    |        |--- Add dependencies to package.json
    |        |
    |--- Merge feature/add-scripts into main
    |        |
    |        |--- Fast-forward merge
    |        |
    |--- Update feature/add-dependencies
    |        |
    |        |--- Add scripts to this branch too
    |        |
    |--- Merge feature/add-dependencies into main
             |
             |--- Conflict in package.json
             |
             |--- Manual resolution
             |
             |--- Final merged state

Timeline:
t0: Initial commit on main
t1: Create feature/add-scripts, add scripts, commit
t2: Create feature/add-dependencies, add dependencies, commit
t3: Merge feature/add-scripts to main (no conflict)
t4: Update feature/add-dependencies with scripts, commit
t5: Merge feature/add-dependencies to main (conflict)
t6: Resolve conflict, commit
t7: Delete both feature branches
t8: Only main remains with all changes

Branch Lifecycle:
1. Create from main: git checkout -b feature/xxx
2. Make changes and commit
3. Switch back to main: git checkout main
4. Merge: git merge feature/xxx
5. Delete: git branch -d feature/xxx
