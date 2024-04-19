import { useState, useCallback } from 'react';
import ReactFlow, { Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import '../index.css'
let x = 200, y = 200;
const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [
  {
    id: '1-2',
    source: '1',
    target: '2'
  }
];


function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [title, setTitle] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const onNodeCreate = () => {
    const randomX = Math.random() * 500; // Generate a random x position
    const randomY = Math.random() * 500; // Generate a random y position

    const newNode = {
      id: (nodes.length + 1).toString(), // Generate a unique ID for the new node
      data: { label: 'New Node' },
      position: { x: randomX, y: randomY },
    };

    setNodes([...nodes, newNode]);
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setTitle(node.data.label || '');
    setShowPopup(true);
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onSaveTitle = () => {
    setNodes(nodes.map(n => {
      if (n.id === selectedNode.id) {
        return {
          ...n,
          data: {
            ...n.data,
            label: title
          }
        };
      }
      return n;
    }));
    setShowPopup(false);
  };

  const onClosePopup = () => {
    setShowPopup(false);
  };

  const onDeleteNode = () => {
    const updatedNodes = nodes.filter(n => n.id !== selectedNode.id);
    setNodes(updatedNodes);
    setSelectedNode(null);
    setShowPopup(false);
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );


  const onConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: 'custom-edge' };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );
  const onDeleteEdge = () => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== selectedEdge.id));
    setSelectedEdge(null);
    setShowDelete(false);
  };

  const onEdgeClick = (event, edge) => {
    setSelectedEdge(edge)
    setShowDelete(true);
    setShowPopup(false);
  };


  return (
    <>
      <button className='btn create-btn' onClick={onNodeCreate}>Create node</button>

      <div>
        <div className='main-div-left' >
            {showPopup && (
              <div className='popup'>
                <div className='input-container'>
                  <input className='input' type="text" value={title} onChange={onTitleChange} />
                </div>
                <div className='btn-container'>
                  <button className='btn btn-pos' onClick={onSaveTitle}>Save</button>
                  <button className='btn btn-pos' onClick={onDeleteNode}>Delete</button>
                  <button className='btn btn-pos' onClick={onClosePopup}>Close</button>
                </div>
              </div>
            )}
            {showDelete && (
              <div className='delete-btn'>
                <button className='btn btn-pos' onClick={onDeleteEdge}>Delete Edge</button>
              </div>
            )
            }
          

          <ReactFlow nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

      </div>
    </>
  );
}

export default Flow;
