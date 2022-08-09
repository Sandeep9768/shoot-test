import React, { Component } from 'react';
function CustomeTable({rowData}) {
  return (
    <div >
      <h1>Theft Bike Table</h1>
      <table style={{    display: "contents"}}>
        <thead>
        <tr>
          <th>title</th>
          <th>description</th>
          <th>date_stolen</th>
          <th>year</th>
          <th>location</th>
        </tr>
        </thead>
        <tbody>
          {
            rowData?.map((res,i)=>{
                let date = new Date(res.date_stolen * 1000);
                return (
                    <tr>
            <td>{res.title}</td>
            <td>{res.description}</td>
            <td>{date.toUTCString()}</td>
            <td>{res.year}</td>
            <td>{res.stolen_location}</td>
          </tr>
                )
            })
          }
          
          </tbody>
      </table>
    </div>
  );
}

export default CustomeTable;