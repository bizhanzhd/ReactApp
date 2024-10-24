import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('MyDatabase.db');

const createTable = () => {
  return new Promise((resolve, reject) => {
      db.transaction((tx) => {
          tx.executeSql(
              `CREATE TABLE IF NOT EXISTS Menu (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name VARCHAR(50),
                  price FLOAT,
                  description TEXT,
                  image VARCHAR(50),
                  category VARCHAR(50)
              );`,
              [],
              (tx, result) => {
                  console.log('Table created successfully');
                  resolve();
              },
              (error) => {
                  console.log('Error creating table', error);
                  reject(error);
              }
          );
      });
  });
};


const fetchDataAndPopulateDB = async () => {
  try {
      // Clear existing data from the Menu table
      await new Promise((resolve, reject) => {
          db.transaction((tx) => {
              tx.executeSql(
                  'DELETE FROM Menu;', // Clear all existing entries
                  [],
                  () => {
                      console.log('Existing data deleted successfully');
                      resolve();
                  },
                  (error) => {
                      console.log('Error deleting existing data', error);
                      reject(error);
                  }
              );
          });
      });

      // Fetch new data
      const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
      const data = await response.json();
      
      // Insert fetched data into SQLite database
      db.transaction((tx) => {
          data.menu.forEach((item) => {
              tx.executeSql(
                  `INSERT INTO Menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)`,
                  [item.name, item.price, item.description, item.image, item.category],
                  (tx, result) => {
                      console.log('Data inserted successfully');
                  },
                  (error) => {
                      console.log('Error inserting data', error);
                  }
              );
          });
      });
  } catch (error) {
      console.log('Error fetching data', error);
  }
};

const fetchUniqueCategories = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT DISTINCT category FROM menu;',
          [],
          (_, { rows }) => {
            const categoriesArray = rows._array.map(row => row.category);
            resolve(categoriesArray);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
};


const getEntriesByCategory = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM Menu;', // Make sure to replace this with your actual table name
            [],
            (_, { rows }) => {
            const entries = rows._array;
            const grouped = entries.reduce((acc, entry) => {
                const { category } = entry;
                if (!acc[category]) {
                acc[category] = [];
                }
                acc[category].push(entry);
                return acc;
            }, {});
            resolve(grouped); // Resolve with the grouped entries
            },
            (_, error) => {
            reject(error); // Reject if there is an error
            }
        );
        });
    });
};

const getEntriesByName = () => {
  return new Promise((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
              'SELECT * FROM Menu;', // Make sure to replace this with your actual table name
              [],
              (_, { rows }) => {
                  const entries = rows._array;

                  // Prepare an object where keys are item names and values are arrays of items
                  const grouped = entries.reduce((acc, entry) => {
                      const { name } = entry;
                      if (!acc[name]) {
                          acc[name] = [];
                      }
                      acc[name].push(entry);
                      return acc;
                  }, {});

                  resolve(grouped); // Resolve with the grouped entries
              },
              (_, error) => {
                  reject(error); // Reject if there is an error
              }
          );
      });
  });
};

export {
    createTable,
    fetchDataAndPopulateDB,
    fetchUniqueCategories,
    getEntriesByCategory,
    getEntriesByName
  };