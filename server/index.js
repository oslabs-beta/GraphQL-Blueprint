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

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.post("/write-files-multiple", (req, res) => {
  const dateStamp = Date.now();
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
      parseGraphqlServer(data)
      
    );
  });
  multipleBuildClientQueries(req, res, dateStamp);
});

function multipleBuildClientQueries(req, res, dateStamp) {
  // **data object in buildClientQueries need to have both the data
  const obj = req.body
  let num = 0;
  const clientQueriesData = {}

  for (let databaseNumber in obj) {
    const dbNumber = obj[databaseNumber];
    for (const index in dbNumber.tables) {
      clientQueriesData[num] = dbNumber.tables[index]
      num++;
    }

    buildClientQueries(clientQueriesData, dateStamp, () => {
      // Builds folder structure
      if (dbNumber.databaseName === "MongoDB")
        buildForMongo(dbNumber.tables, dateStamp, dbNumber.name);
      if (dbNumber.databaseName === "MySQL")
        buildForMySQL(dbNumber.tables, dateStamp, dbNumber.name);
      if (dbNumber.databaseName === "PostgreSQL")
        buildForPostgreSQL(dbNumber.tables, dateStamp, dbNumber.name);
    });
  }
  sendResponse(dateStamp, res, () => {
    setTimeout(() => {
      deleteTempFiles(obj, dateStamp, () => {
        deleteTempFolders(dateStamp, () => {});
      });
    }, 5000);
  });
}





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
  fs.mkdirSync(
    path.join(
      PATH,
      `build-files${dateStamp}`,
      "server",
      "db",
      `${databaseName}`
    )
  );
}

function buildForMongo(data, dateStamp, databaseName) {
  buildDatabaseFolder(databaseName, dateStamp);
  const indexes = Object.keys(data);

  indexes.forEach((index) => {
    fs.writeFileSync(
      path.join(
        PATH,
        `build-files${dateStamp}/server/db/${databaseName}/${data[
          index
        ].type.toLowerCase()}.js`
      ),
      parseMongoSchema(data[index])
    );
  });
}

function buildForMySQL(data, dateStamp, databaseName) {
  buildDatabaseFolder(databaseName, dateStamp);
  fs.writeFileSync(
    path.join(
      PATH,
      `build-files${dateStamp}/server/db/${databaseName}/sql_pool.js`
    ),
    sqlPool("MySQL")
  );
  fs.writeFileSync(
    path.join(
      PATH,
      `build-files${dateStamp}/server/db/${databaseName}/mysql_scripts.sql`
    ),
    // SERVER/DB/SCRIPTS
    parseMySQLTables(data)
  );
}

function buildForPostgreSQL(data, dateStamp, databaseName) {
  buildDatabaseFolder(databaseName, dateStamp);
  fs.writeFileSync(
    path.join(
      PATH,
      `build-files${dateStamp}/server/db/${databaseName}/sql_pool.js`
    ),
    sqlPool("Postgres")
  );
  fs.writeFileSync(
    path.join(
      PATH,
      `build-files${dateStamp}/server/db/${databaseName}/postgresql_scripts.sql`
    ),
    parsePostgresTables(data)
  );
}

function deleteTempFiles(obj, dateStamp, cb) {
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/readme.md`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/package.json`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/webpack.config.js`));
  fs.unlinkSync(path.join(PATH, `build-files${dateStamp}/client/index.js`));
  fs.unlinkSync(
    path.join(PATH, `build-files${dateStamp}/client/graphql/queries/index.js`)
  );
  fs.unlinkSync(
    path.join(PATH, `build-files${dateStamp}/client/graphql/mutations/index.js`)
  );
  fs.unlinkSync(
    path.join(PATH, `build-files${dateStamp}/client/components/index.js`)
  );
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

  for (let dbNumber in obj) {
    const name = dbNumber.name;
    const database = dbNumber.databaseName;
    const data = dbNumber.tables;
    if (database === "PostgreSQL") {
      fs.unlinkSync(
        path.join(PATH, `build-files${dateStamp}/server/db/${name}/sql_pool.js`)
      );
      fs.unlinkSync(
        path.join(
          PATH,
          `build-files${dateStamp}/server/db/${name}/postgresql_scripts.sql`
        )
      );
    }

    if (database === "MySQL") {
      fs.unlinkSync(
        path.join(PATH, `build-files${dateStamp}/server/db/${name}/sql_pool.js`)
      );
      fs.unlinkSync(
        path.join(
          PATH,
          `build-files${dateStamp}/server/db/${name}/mysql_scripts.sql`
        )
      );
    }

    if (database === "MongoDB") {
      const indexes = Object.keys(data);

      function step(i) {
        if (i < indexes.length) {
          fs.unlinkSync(
            path.join(
              PATH,
              `build-files${dateStamp}/server/db/${name}/${data[
                indexes[i]
              ].type.toLowerCase()}.js`
            )
          );
          step(i + 1);
        }
      }
      step(0);
    }
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
  fs.rmdirSync(path.join(PATH, `build-files${dateStamp}`, "server", "db"), {
    recursive: true,
  });
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
  const filePath = path.join(PATH, `graphql${dateStamp}.zip`);
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-disposition", "attachment");
  res.download(filePath, (err) => {
    if (err) console.log("Error inside sendResponse:", err);
    else console.log("Download Complete!");
    return cb();
  });
}

app.listen(PORT, () => {
  console.log(`Server Listening to ${PORT}!`);
});
