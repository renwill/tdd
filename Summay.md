# Installtion
### Install [Nodemon](https://github.com/remy/nodemon)
```
npm install -g nodemon
```
In case you got below error: 
```
nodemon is not recognized as an internal or external command, program or batch file
```
Since node prefix is not in the PATH ENV variable, any of the globally installed modules are not getting recognized. Try:
```
C:\>npm config get prefix
C:\Users\username\AppData\Roaming\npm
C:\>set PATH=%PATH%;C:\Users\username\AppData\Roaming\npm;
```

### Install Mocha
```
npm install -g mocha
git clone xxxx.git
npm install
```

# Run the application
#### Start application
```
npm start 
//Whilst nodemon is running, type rs to restart Nodemon
```
#### Monitor file changes for automatic testing
```
npm test
```