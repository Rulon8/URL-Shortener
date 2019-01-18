import Table from 'react-bootstrap/lib/Table.js';
import React from 'react';
import './styles.css';

/* Shows a table with the title, original URL, short URL and number if registered
 * visits of each of the top 100 URLs with most visits. If there are less than 100
 * URLs registered in the system shows them all, and if there are none shows a 'No
 * data available' message.
 */
const TopTable = (props) => {
  let content;
  if (props.status === 'success') {
    if (props.tableData.length === 0) {
      content = <p className='text top-table'>No data available</p>;
    } else {
      content = 
      <Table className='top-table' striped hover responsive bordered>
       <thead>
        <tr>
          <th>Title</th>
          <th>Long URL</th>
          <th>Short URL</th>
          <th>Visit Count</th>
        </tr>
       </thead>
       <tbody>
         {props.tableData.map(function(url, index) {
           return <tr key={url.short_url}>
                    <td>{url.title}</td>
                    <td>{url.original_url}</td>
                    <td><a href={url.short_url}>{url.short_url}</a></td>
                    <td>{url.visit_count}</td>
                  </tr>;
         })}
       </tbody>
     </Table>;
    }
  }
  return (
    <div>
     {content}
    </div>
  );
};

export default TopTable;