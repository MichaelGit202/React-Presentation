
# React Native SQLite Project for Android
# The Two Projects
  1. under the React_sqllite folder there is the project for the SQLlite example
  2. Under the react folder is a simple example of react code

## Goal
Create a React Native app that interfaces with a SQLite database.

## Tools
- React (library)
- Android Studio

## Prerequisites
- Know how to create a React Native project
- Android Studio is already installed

---

## Installation

### 1. Create your React Native project

### 2. Install SQLite into your project

```bash
npm install --save react-native-sqlite-storage
```

### 3. Installing an Android Emulator

a. Open **Virtual Device Manager** in Android Studio  
b. Create a new device:  
  - **Device:** Medium phone  
  - **System Image:** Google Play Intel x86 Atom System Image API 24  
    - To see this option, click **API**, scroll down, and enable **Show All**  
  - **API Level:** API 24 “Nougat” Android 7.0  
  - **Additional Settings:**  
    - Internal Storage: 6 GB  
    - Expanded Storage: 6 GB  

c. Go back to your project and run:

```bash
npx expo run:android
```

d. You might need to add a file under:

```
<Your Project>/android/local.properties
```

If the file does not exist, create it and add the following (replacing with your actual username):

```
sdk.dir=C:\Users\<YOUR COMPUTER USERNAME>\AppData\Local\Android\Sdk
```

e. Hopefully, at this point your phone emulator launches and `npx expo run:android` launches the app within the phone.

---

## Code Walkthrough

The main code is under the `RN_SQLite_Demo` folder in the GitHub repo.

### `App/tabs/explore.tsx`

This screen contains the text inputs and the CRUD functions that interact with the database.  
Normally you’d have these in their own file and import them.

- **Create (C):** `handleSave()`  
- **Read (R):** `loadData()`  
- **Update (U):** `handleSave()`  
- **Delete (D):** `handleResetDatabase()`

Then there is `setupTable`, which creates the table if it does not exist.

Each handler function essentially just runs SQL statements on the database.  
They are asynchronous and run inside `useEffect()` to avoid blocking the UI.

### Database Declaration

```tsx
const database = useSQLiteContext();
```

The actual database is declared in `_layout.tsx` using:

```tsx
<SQLiteProvider databaseName="mydb.db">
```

This wraps the whole application in a SQLite context. If `mydb.db` does not exist, it is created.

---

### Refreshing the Table

Back in `explore.tsx`:

```tsx
<UserList refreshSignal={refreshSignal} />
```

The `RefreshSignal` state is used to dynamically update the table.

If you go to `components/userList.tsx` (or ctrl+click the `UserList` tag), you'll see:

```tsx
export default function UserList({ refreshSignal }: Props) {
  const database = useSQLiteContext();
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const results = await database.getAllAsync<{
          id: number;
          name: string;
          email: string;
        }>(\`SELECT * FROM users\`);
        setUsers(results);
      } catch (e) {
        console.error("Failed to load users:", e);
      }
    };

    loadUsers();
  }, [refreshSignal]);
}
```

Since `refreshSignal` is a dependency in the `useEffect`, the `loadUsers()` function re-runs every time `refreshSignal` changes.  
This gives us real-time updating of the table.

---

## Repo

🔗 [GitHub Repo: React-Presentation]https://github.com/MichaelGit202/React-SQlite-Example/
