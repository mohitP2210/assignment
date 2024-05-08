import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPenSquare, FaTrash } from 'react-icons/fa';

const Work = () => {
  const [data, setData] = useState([]);
  let [bolin,setBolin]=useState(false);
  let [index,setIndex]=useState();
  let [inputdata,setInputdata]=useState({name:"",number:""})
  const [currpg, setCurrPg] = useState(1);
  const [search, setSearch] = useState('');
  let {name,number}=inputdata;
  const recordPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Fetch data on component mount

  const filteredData = data && data.filter((item) => {
    const itemName = item.name || ""; // If item.name is undefined, set it to an empty string
    return search && (search.toLowerCase() === "" || itemName.toLowerCase().includes(search.toLowerCase()));
});


  // Calculate records based on current page and records per page
  const firstIndex = (currpg - 1) * recordPerPage;
  const lastIndex = firstIndex + recordPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const prepage = () => {
    // Implement the logic for going to the previous page
    if (currpg !== 1) {
      setCurrPg(currpg - 1);
    }
  };

  const nextpage = () => {
    // Implement the logic for going to the next page
    if (currpg !== npage) {
      setCurrPg(currpg + 1);
    }
  };

  const changecpage = (id) => {
    // Implement the logic for changing the current page
    setCurrPg(id);
  };
  function updaterow(i) {
    // Assuming you have input fields to get the updated values
    const updatedName = prompt("Enter updated name:");
    const updatedEmail = prompt("Enter updated email:");
    const updatedRole = prompt("Enter updated role:");
  
    if (updatedName && updatedEmail && updatedRole) {
      // Create a copy of the data array
      let updatedData = [...data];
  
      // Update the specified row with the new values
      updatedData[i] = {
        ...updatedData[i],
        name: updatedName,
        email: updatedEmail,
        role: updatedRole,
      };
  
      // Update the state with the modified data
      setData(updatedData);
    }
  }
  
   function deleterow(i){
    console.log(i,"this index row want to be delete");
    let total=[...data];
    total.splice(i,1);
    setData(total);
   }
  return (
    <div>
      <Container>
        <Form>
          <InputGroup className='my-3'>
            {/* onChange for search */}
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search'
            />
          </InputGroup>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>PRICE</th>
              <th>DESCRIPTION</th>
              <th>CATEGORY</th>
              <th>SOLD</th>
              <th>IMAGE</th>
            </tr>
          </thead>
          <tbody>
            {records.map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.title}</td>
                <td>{d.price}</td>
                <td>{d.description}</td>
                <td>{d.category}</td>
                <td>{(d.sold==true)?"true":"false"}</td>
                <td><img src={d.image} style={{height:"200px",width:"200px"}} alt="required"/></td>
                {/* <td>
                <button onClick={() => updaterow(i)}><FaPenSquare/></button>
                <button onClick={() => deleterow(i)}><FaTrash/></button>

                </td> */}
              </tr>
            ))}
          </tbody>
          
        </Table>
      </Container>
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prepage}>
              Prev
            </a>
          </li>
          {numbers.map((n, i) => (
            <li className={`page-item ${(currpg === n) ? 'active' : ''}`} key={i}>
              <a href="#" className="page-link" onClick={() => changecpage(n)}>
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a className="page-link" onClick={nextpage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Work;

