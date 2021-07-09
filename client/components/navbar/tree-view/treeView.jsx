import React from 'react';
import { connect } from 'react-redux';
import Tree from 'react-d3-tree';

// styles
import './treeView.css';

const mapStateToProps = store => ({
  databases: store.multiSchema.databases
});

const mapDispatchToProps = dispatch => ({

});

const treeViewify = data => {
  //  initialize tree
  const tree = {
    name: 'GraphQL Endpoint'
  }

  //  declare first children layer array
  const firstChildrenArray = [];

  if (typeof data.databases === 'object' && data.databases !== null && JSON.stringify(data.databases)!=='{}') {
    for (const [databaseIndex, databaseObject] of Object.entries(data.databases)) {
      const firstChildrenObject = {};

      if (typeof databaseObject === 'object' && databaseObject !== null && JSON.stringify(databaseObject)!=='{}') {
        const secondChildrenArray = [];
        firstChildrenObject['name'] = databaseObject.name;
        firstChildrenObject['attributes'] = {"type": databaseObject.database};

        for (const [tableIndex, tableObject] of Object.entries(databaseObject.tables)) {
          const secondChildrenObject = {};

          if (typeof databaseObject.tables === 'object' && databaseObject.tables !== null && JSON.stringify(databaseObject.tables)!=='{}'){
            const thirdChildrenArray = [];
            secondChildrenObject['name'] = tableObject.type;

            for (const [fieldIndex, fieldObject] of Object.entries(tableObject.fields)) {
              const thirdChildrenObject = {};

              if (typeof tableObject.fields === 'object' && tableObject.fields !== null){
                thirdChildrenObject['name'] = fieldObject.name;
                thirdChildrenObject['attributes'] = {"type": fieldObject.type}
                thirdChildrenArray.push(thirdChildrenObject)
              } 
            }
            secondChildrenObject['children'] = thirdChildrenArray;
            secondChildrenArray.push(secondChildrenObject)
          } 
        }
        firstChildrenObject['children'] = secondChildrenArray;
        firstChildrenArray.push(firstChildrenObject);
      }
    }
    tree['children'] = firstChildrenArray
  }

  return tree
}

// This is a simplified example of an org chart to be fed into D3 React Tree

// const orgChart = {
//   name: 'CEO',
//   children: [
//     {
//       name: 'Manager',
//       attributes: {
//         department: 'Production',
//       },
//       children: [
//         {
//           name: 'Foreman',
//           attributes: {
//             department: 'Fabrication',
//           },
//           children: [
//             {
//               name: 'Worker',
//             },
//           ],
//         },
//         {
//           name: 'Foreman',
//           attributes: {
//             department: 'Assembly',
//           },
//           children: [
//             {
//               name: 'Worker',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
const renderRectSvgNode = ({ nodeDatum, toggleNode }) => (
  <g>
    <rect width="20" height="20" x="-10" onClick={toggleNode} />
    <text fill="white" strokeWidth="1" x="20">
      {nodeDatum.name}
    </text>
    {nodeDatum.attributes && nodeDatum.attributes.type &&
      <text fill="white" x="20" dy="20" strokeWidth="1">
      Type: {nodeDatum.attributes.type}
      </text>
    }
  </g>
);

const TreeView = (databases) => {
  const treeData=treeViewify(databases);
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: '80em', height: '35em' }}>
      <Tree 
        data={(treeData)}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        renderCustomNodeElement={renderRectSvgNode}
        orientation='vertical'
        />
    </div>
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(TreeView)