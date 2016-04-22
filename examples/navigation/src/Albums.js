import React from 'react';

export default ({albums}) => {
    var items = albums.map((album) => (
        <li>{album.title}</li>
    ))
    return <ul>{items}</ul>;
}