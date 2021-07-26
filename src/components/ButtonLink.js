import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ButtonLink.css';


function ButtonLink(props) {
    return(
<Link to={"/" + props.page}>
<button className='navButton' type="button"><span>{props.name}</span></button>
</Link>
    )


}
export default ButtonLink;