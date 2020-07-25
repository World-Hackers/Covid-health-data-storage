import React from 'react';
import { NavLink } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';

class Menu extends React.Component {
    render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed='top'>
                <Navbar.Brand href="/">Health Manager</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <NavLink to="/upload" style={{padding: '5px', color: 'white'}}>Upload</NavLink> */}
                        <NavLink to="/register" style={{padding: '5px', color: 'white'}}>Register</NavLink>
                        <NavLink to="/patient" style={{padding: '5px', color: 'white'}}>Patient</NavLink>
                        <NavLink to="/download" style={{padding: '5px', color: 'white'}}>Download</NavLink>
                        <NavLink to="/owner" style={{padding: '5px', color: 'white'}}>Owner</NavLink>
                        {/* <NavLink to="/admin" style={{padding: '5px', color: 'white'}}>Admin </NavLink> */}
                        <NavLink to="/doctor" style={{padding: '5px', color: 'white'}}>Doctor</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Menu;