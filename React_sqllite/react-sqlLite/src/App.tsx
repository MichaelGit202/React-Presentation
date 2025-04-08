
import { useState, useEffect } from 'react';
import initSqlJs, { Database, QueryExecResult } from 'sql.js';
import './App.css';	
// what is in this file?
  //  this is a simple sqlite demonstration for a react frontend
  //  sqlite is done to store data locally in a database for a front end for like caching data
  //  or for prototypes and projects that don't need server side databases
  //  it is used essentially anywhere you need a local db
	
// yea im putting it right in the main app component, usually you would have a whole
// ts file dedicated to this interaction layer
	
export default function App() {
  const [db, setDb] = useState<Database | null>(null); // state management for database object
  const [items, setItems] = useState<Array<{ id: number; name: string }>>([]); 
  const [newItem, setNewItem] = useState<string>('');
	
  // Initialize SQLite
  // UseEffect is a react hook for running things with dependencies when the page loads after the intial render
  // in other words its for using non-ts/js code
  useEffect(() => {
    const initialize = async () => {        //declaring initialize function 
      const newDb = await loadFromLocalStorage();     //declaring the db
      setDb(newDb);                         //state management function, see declaration ^
    };
    initialize();
  }, []);
	
  // Query Helper
  // this function  gets the data from the database
  const query = (sql: string, params: any[] = []): QueryExecResult[] => {
    if (!db) return []; // no database exception
    try {
      return db.exec(sql, params);  //.execute is a sqlite function that will execute sql commands
    } catch (e) {
      console.error("Query error:", e);
      return [];
    }
  };
	
  // Insert New Item
  // db.run is just another execution function but nothing is returned
  const addItem = () => {
    if (!db || !newItem.trim()) return;
    db.run("INSERT INTO items (name) VALUES (?)", [newItem]);
    setNewItem('');
    refreshItems();
  };
	
 // Refresh List, this just pulls all the data from the database to display it
  //the list,
  const refreshItems = () => {
    const result = query("SELECT * FROM items");
    if (result.length > 0) {
      const { columns, values } = result[0];
      const parsed = values.map(row => Object.fromEntries(row.map((val, i) => [columns[i], val]))) as Array<{ id: number, name: string }>;
      setItems(parsed);
    }
 };
	
  // if a database exists, load it
  useEffect(() => {
    if (db) refreshItems();
  }, [db]);
	
  // these two functions load the database from actual storage
  const saveToLocalStorage = () => {
    if (db) {
      const data = db.export(); // Get Uint8Array of the DB
      const base64 = btoa(String.fromCharCode(...data)); // Convert to base64
      localStorage.setItem('sqlite-db', base64);
    }
  };
	
  // Utility to load DB from localStorage
  const loadFromLocalStorage = async () => {
  const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
  const saved = localStorage.getItem('sqlite-db');
	
  if (saved) {
    const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    return new SQL.Database(bytes);
  } else {
    const db = new SQL.Database();
    //if we dont have any database, we create the database
    db.run("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
    return db;
  }
};
	
// reset function for demonstration, just deletes all the data
const resetDB = () => {
  localStorage.removeItem('sqlite-db');
  window.location.reload();
};
	


	  // UI
	  return (
	
	    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
	      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
	        <h1 className="text-2xl font-bold mb-4">SQLite in React (sql.js)</h1>
	
	        <div className="flex gap-2 mb-4">
	
	          <input
	            type="text"
	            placeholder="Enter item name"
	            value={newItem}
	            onChange={e => setNewItem(e.target.value)}
	            className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
	          />
	
	          <button
	            onClick={addItem}
	            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
	          >
	            Add
	          </button>
	          <button
	            onClick={saveToLocalStorage}
	            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
	          >
	            save
	          </button>
	          <button
	            onClick={resetDB}
	            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
	          >
	            reset
	          </button>
	
	        </div>
	
	        <ul className="space-y-2">
	          {items.map(item => (
	            <li
	              key={item.id}
	              className="bg-blue-100 text-blue-900 px-4 py-2 rounded-xl shadow-sm"
	            >
	              {item.name} <span className="text-sm text-gray-500">(id: {item.id})</span>
	            </li>
	          ))}
	
	        </ul>
	      </div>
	    </div>
	  );
	}
