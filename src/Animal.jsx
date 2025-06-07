import React from "react";
import { ListGroup } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";

export default function Animal({animal}){
    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div>
                <h5>{animal.name}</h5>
                <p>Type: {animal.type}</p>
                <p>Age: {animal.age} years</p>
            </div>
            <button className="btn btn-primary">Adopt</button>
        </ListGroup.Item>
    );
}