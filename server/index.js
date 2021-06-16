// use graphqlkdesinger.com to see how folder structure supposed to look like
// outside in
// builddirectories working
  // database folder has a folder for each database
// modify mutatations and queries in client, (both databases should be in one text file)
//buildqueries and buildgraphql server
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const zipper = require("zip-local");
const path = require("path");

const app = express();

//Build Function Import
const createReadMe = require("../utl/create_file_func/create_readme");
const buildExpressServer = require("../utl/create_file_func/express_server");
const parseClientQueries = require("../utl/create_file_func/client_queries");
const parseClientMutations = require("../utl/create_file_func/client_mutations");
const parseGraphqlServer = require("../utl/create_file_func/graphql_server");
const parseMongoSchema = require("../utl/create_file_func/mongo_schema");
const parseMySQLTables = require("../utl/create_file_func/mysql_scripts");
const parsePostgresTables = require("../utl/create_file_func/postgresql_scripts");
const buildPackageJSON = require("../utl/create_file_func/create_packagejson");
const buildWebpack = require("../utl/create_file_func/create_webpack");
const buildIndexHTML = require("../utl/create_file_func/create_indexhtml");
const buildClientRootIndex = require("../utl/create_file_func/create_client_root_index");
const buildComponentIndex = require("../utl/create_file_func/create_component_index");
const buildComponentStyle = require("../utl/create_file_func/create_component_style");
const sqlPool = require("../utl/create_file_func/sql_pool");
const { CommunicationBusiness } = require("material-ui/svg-icons");
const { default: build } = require("material-ui/svg-icons/action/build");

const PORT = process.env.PORT || 4100;
let PATH;

if (process.env.MODE === "prod") {
  PATH = "/tmp/";
} else {
  PATH = path.join(__dirname, "../../");
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));
// Only makes fetch request when you click export code
// Loop through array of databases (dataTypes)
// create files for each database in the request body

// Have variable that keeps count of how many databases per type (mongdob1, mongodb2)

// Create multiple databases
// everytime you create a new database, you should have a diff path, one folder for each different database
// under each "type" folder, have a folder for each indivisual database, for cases where users want to create two or more of the same type of database
// right now, everything is being created in the build-files folder
app.post("/write-files", (req, res) => {
  const data = req.body; // data.data is state.tables from schemaReducer. See Navbar component

  console.log("data from post request:", data);

  // Write function for rejecting request if data.database is not one of the three database
  const dateStamp = Date.now();

  // Creates general files
  buildDirectories(dateStamp, () => {
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/readme.md`),
      createReadMe()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/package.json`),
      buildPackageJSON(data.databaseName)
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/webpack.config.js`),
      buildWebpack()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/client/index.js`),
      buildClientRootIndex()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/client/components/index.js`),
      buildComponentIndex()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/client/components/index.css`),
      buildComponentStyle()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/index.js`),
      buildExpressServer(data.databaseName)
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/public/index.html`),
      buildIndexHTML()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/public/styles.css`),
      ""
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`),
      parseGraphqlServer(data.data, data.databaseName)
    );

    // Depends on database you select, creates files for selected database
    // buildClientQueries(data.data, dateStamp, () => {
    //   if (data.database === "MongoDB") buildForMongo(data.data, dateStamp);
    //   if (data.database === "MySQL") buildForMySQL(data.data, dateStamp);
    //   if (data.database === "PostgreSQL")
    //     buildForPostgreSQL(data.data, dateStamp);

    //   sendResponse(dateStamp, res, () => {
    //     setTimeout(() => {
    //       deleteTempFiles(data.database, data.data, dateStamp, () => {
    //         deleteTempFolders(dateStamp, () => {});
    //       });
    //     }, 5000);
    //   });
    // });
    multipleBuildClientQueries (data);
    function multipleBuildClientQueries(obj) {
      // console.log('here at checkDataLength')
      // console.log(Object.keys(obj).length)
      if (Object.keys(obj).length <= 1) {
        // if length <= 1, run buildClientQueries function
        const Database1 = obj[Object.keys(obj)[0]];
        console.log('obj.Database1.databaseName:', obj.Database1.databaseName);
        console.log('obj:', obj)
        buildClientQueries(obj.Database1.data, dateStamp, () => {
          if (obj.Database1.databaseName === "MongoDB") buildForMongo(obj.Database1.data, dateStamp);
          if (obj.Database1.databaseName === "MySQL") buildForMySQL(obj.Database1.data, dateStamp);
          if (obj.Database1.databaseName === "PostgreSQL") buildForPostgreSQL(obj.Database1.data, dateStamp);
          sendResponse(dateStamp, res, () => {
            setTimeout(() => {
              deleteTempFiles(obj.Database1.databaseName, obj.Database1.data, dateStamp, () => {
                deleteTempFolders(dateStamp, () => {});
              });
            }, 5000);
          });
        });
      }
      // else {
      //   // else, loop through data object, and run buildClientQuaries on every one
      //   for (let databaseNumber in obj) {
      //     // e.g. databaseNumber -> 'Database1'
      //     const dbNumber = obj[databaseNumber]; // Everything inside 'Database1'
      //     buildClientQueries(dbNumber.data, dateStamp, () => {
      //       if (dbNumber.database === "MongoDB") buildForMongo(dbNumber.data, dateStamp);
      //       if (dbNumber.database === "MySQL") buildForMySQL(dbNumber.data, dateStamp)
      //       if (dbNumber.database === "PostgreSQL") buildForPostgreSQL(dbNumber.data, dateStamp);
      //       sendResponse(dateStamp, res, () => {
      //         setTimeout(() => {
      //           console.log('before deleteTempFiles')
      //           deleteTempFiles(dbNumber.database, dbNumber.data, dateStamp, () => {
      //             console.log('after deleteTempFiles');
      //             deleteTempFolders(dateStamp, () => {});
      //             console.log('afterDeleteTempFolders');
      //           });
      //         }, 5000);
      //       });
      //     });
      //   }
      // }
    }
    
  });
});

function callBuildDirectories(req, res, dateStamp) {
  
  const data = req.body; 

  buildDirectories(dateStamp, () => {
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/readme.md`),
      createReadMe()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/package.json`),
      buildPackageJSON(data.databaseName)
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/webpack.config.js`),
      buildWebpack()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/client/index.js`),
      buildClientRootIndex()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/client/components/index.js`),
      buildComponentIndex()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/client/components/index.css`),
      buildComponentStyle()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/index.js`),
      buildExpressServer(data.databaseName)
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/public/index.html`),
      buildIndexHTML()
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/public/styles.css`),
      ""
    );
    fs.writeFileSync(
      path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`),
      parseGraphqlServer(data.data, data.databaseName)
    );
  });
}
const storage = {dateStampStorage: [], dataStorage: [], databaseNameStorage: []}
// Figure out what exactly is being built in directories, and figure out what is being deleted in deleteTemp and deleteFolders
app.post("/write-files-multiple", (req, res) => {
  multipleBuildClientQueries (req.body);
  // res.locals.storage = {dateStampStorage: [], dataStorage: [], databaseNameStorage: []}
  // console.log('res.locals.storage', res.locals.storage)

  function multipleBuildClientQueries(obj) {
    const dateStamp = Date.now();
    callBuildDirectories(req, res, dateStamp);
    for (let databaseNumber in obj) {
      
      const dbNumber = obj[databaseNumber]; 
      
      storage.dateStampStorage.push(dateStamp);
      storage.dataStorage.push(dbNumber.data);
      storage.databaseNameStorage.push(dbNumber.databaseName);
      
      // e.g. databaseNumber -> 'Database1'
      // Everything inside 'Database1'
      console.log('before buildClientQueries')
      // PUT OUTSIDE OF LOOP
      buildClientQueries(dbNumber.data, dateStamp, () => {
        // console.log('dbNumber:', dbNumber);
        if (dbNumber.databaseName === "MongoDB") buildForMongo(dbNumber.data, dateStamp, dbNumber.name);
        if (dbNumber.databaseName === "MySQL") buildForMySQL(dbNumber.data, dateStamp, dbNumber.name)
        if (dbNumber.databaseName === "PostgreSQL") buildForPostgreSQL(dbNumber.data, dateStamp, dbNumber.name);
        console.log('after buildForPostgreSQL')
        
        
      });
    }
    sendResponse(dateStamp, res, () => {
    
      console.log('in sendResponse in multipleBuildClientQueries')
      setTimeout(() => {
        console.log('after setTimeout()')
        console.log('before deleteTempFiles')
        //loop here
        deleteTempFiles(dbNumber.databaseName, dbNumber.data, dateStamp, () => {
        console.log('after deleteTempFiles');
        deleteTempFolders(dateStamp, () => {});
        console.log('after deleteTempFolders');
        });
      }, 5000);
    });
  }

  //datestamps object
  
})
// middleware function for downloading files

app.listen(PORT, () => {
  console.log(`Server Listening to ${PORT}!`);
});

// function that creates new database
function buildDirectories(dateStamp, cb) {
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, "client"));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, "client", "graphql"));
  fs.mkdirSync(
    path.join(PATH, `build-files${dateStamp}`, "client", "graphql", "queries")
  );
  fs.mkdirSync(
    path.join(PATH, `build-files${dateStamp}`, "client", "graphql", "mutations")
  );
  fs.mkdirSync(
    path.join(PATH, `build-files${dateStamp}`, "client", "components")
  );
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, "server"));
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, "server", "db"));
  // build folders for each database
  fs.mkdirSync(
    path.join(PATH, `build-files${dateStamp}`, "server", "graphql-schema")
  );
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, "server", "public"));
  return cb();
}
// Run outside of loop, add all tables to it as loop is overwriting 
// should be one docu with every query from every database
function buildClientQueries(data, dateStamp, cb) {
  // console.log("data from buildClientQueries (data):", data)
  // console.log(
  //   "dateStamp: ",
  //   `build-files${dateStamp}/client/graphql/queries/index.js`
  // );
  // console.log("cb:", cb);

  // LOOP HERE 
  fs.writeFileSync(
    path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`),
    parseClientQueries(data)
  );
  fs.writeFileSync(
    path.join(
      PATH,
      `build-files${dateStamp}/client/graphql/mutations/index.js`
    ),
    parseClientMutations(data)
  );

  return cb();
}
function buildDatabaseFolder(databaseName, dateStamp) {
  fs.mkdirSync(path.join(PATH, `build-files${dateStamp}`, "server", "db", `${databaseName}`));
}

function buildForMongo(data, dateStamp, databaseName) {
  buildDatabaseFolder(databaseName, dateStamp);
  const indexes = Object.keys(data);

  indexes.forEach((index) => {
    fs.writeFileSync(
      path.join(
        PATH,
        `build-files${dateStamp}/server/db/${databaseName}/${data[index].type.toLowerCase()}.js`
      ),
      parseMongoSchema(data[index])
    );
  });
}

function buildForMySQL(data, dateStamp, databaseName) {

  buildDatabaseFolder(databaseName, dateStamp);
  fs.writeFileSync(
    path.join(PATH, `build-files${dateStamp}/server/db/${databaseName}/sql_pool.js`),
    sqlPool("MySQL")
  );
  console.log('data in buildForMySQL:', data)
  fs.writeFileSync(
    path.join(PATH, `build-files${dateStamp}/server/db/${databaseName}/mysql_scripts.sql`),
    // SERVER/DB/SCRIPTS
    parseMySQLTables(data)
  );

}

function buildForPostgreSQL(data, dateStamp, databaseName) {
  buildDatabaseFolder(databaseName, dateStamp);
  fs.writeFileSync(
    path.join(PATH, `build-files${dateStamp}/server/db/${databaseName}/sql_pool.js`),
    sqlPool("Postgres")
  );
  fs.writeFileSync(
    path.join(PATH, `build-files${dateStamp}/server/db/${databaseName}/postgresql_scripts.sql`),
    parsePostgresTables(data)
  );
}

function deleteTempFiles(database, data, dateStamp, cb) {
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/readme.md`));
  // console.log(PATH, `build-files${dateStamp}/readme.md`)
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/package.json`));
  // console.log(PATH, `build-files${dateStamp}/package.json`)
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/webpack.config.js`));
  // console.log(PATH, `build-files${dateStamp}/webpack.config.js`)
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/index.js`));
  // console.log(PATH, `build-files${dateStamp}/client/index.js`)
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`));
  // console.log(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`)
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/graphql/mutations/index.js`));
  // console.log(PATH, `build-files${dateStamp}/client/graphql/mutations/index.js`)
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/components/index.js`));
  fs.unlinkSync(
    path.join(PATH, `build-files${dateStamp}/client/components/index.css`)
  );
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/server/index.js`));
  fs.unlinkSync(
    path.join(PATH, `build-files${dateStamp}/server/graphql-schema/index.js`)
  );
  fs.unlinkSync(
    path.join(PATH, `build-files${dateStamp}/server/public/index.html`)
  );
  fs.unlinkSync(
    path.join(PATH, `build-files${dateStamp}/server/public/styles.css`)
  );
  fs.unlinkSync(path.join(PATH, `graphql${dateStamp}.zip`));

  if (database === "PostgreSQL") {
    fs.unlinkSync(
      path.join(PATH, `build-files${dateStamp}/server/db/sql_pool.js`)
    );
    fs.unlinkSync(
      path.join(
        PATH,
        `build-files${dateStamp}/server/db/postgresql_scripts.sql`
      )
    );
  }

  if (database === "MySQL") {
    fs.unlinkSync(
      path.join(PATH, `build-files${dateStamp}/server/db/sql_pool.js`)
    );
    fs.unlinkSync(
      path.join(PATH, `build-files${dateStamp}/server/db/mysql_scripts.sql`)
    );
  }

  if (database === "MongoDB") {
    const indexes = Object.keys(data);

    function step(i) {
      if (i < indexes.length) {
        fs.unlinkSync(
          path.join(
            PATH,
            `build-files${dateStamp}/server/db/${data[
              indexes[i]
            ].type.toLowerCase()}.js`
          )
        );
        step(i + 1);
      }
    }
    step(0);
  }

  return cb();
}

function deleteTempFolders(dateStamp, cb) {
  fs.rmdirSync(
    path.join(PATH, `build-files${dateStamp}`, "client", "graphql", "queries")
  );
  fs.rmdirSync(
    path.join(PATH, `build-files${dateStamp}`, "client", "graphql", "mutations")
  );
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, "client", "graphql"));
  fs.rmdirSync(
    path.join(PATH, `build-files${dateStamp}`, "client", "components")
  );
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, "server", "public"));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, "server", "db"));
  fs.rmdirSync(
    path.join(PATH, `build-files${dateStamp}`, "server", "graphql-schema")
  );
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, "client"));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, "server"));
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`));
  return cb();
}

function sendResponse(dateStamp, res, cb) {
  zipper.sync
    .zip(path.join(PATH, `build-files${dateStamp}`))
    .compress()
    .save(path.join(PATH, `graphql${dateStamp}.zip`));
  // console.log('middle of sendResponse')
  const filePath = path.join(PATH, `graphql${dateStamp}.zip`);
  // console.log('filePath inside sendResponse:', filePath);
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-disposition", "attachment");
  console.log('end of sendResponse \n')
  res.download(filePath, (err) => {
    console.log('inside res.download')
    // console.log('file:', file, '\n')
    if (err) console.log('Error inside sendResponse:', err) 
    else console.log("Download Complete!");
    return cb();
  });
}
