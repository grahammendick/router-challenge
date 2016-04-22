import React from 'react';

export default ({albums, id}) => {
    if (!id)
        return <p>None</p>;
    var album = albums.filter((album) => (
        album.id === id
    ))[0];
    var tracks = album.side1.map((track) => (
        <li>{track}</li>
    ))
    return <ul>{tracks}</ul>;
}