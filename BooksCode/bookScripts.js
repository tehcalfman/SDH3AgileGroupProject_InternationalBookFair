class Book{
    #title;
    #author;
    #genre;
    #description;
    #img;
    constructor(title,author,genre,description,img){
        this.#title = title;
        this.#author = author;
        this.#genre = genre;
        this.#description = description;
        this.#img = img;
    }
}

let books = null;
fetch('books.json').then(response => response.json()).then(data => {
    books = data;
    convertDatatoTable(books);
})

function convertDatatoTable(jsonData){
    let tableBody = '<tbody>';
    const headers = ["title","author","genre"];

    console.log(jsonData);

    jsonData.forEach(row => {
        tableBody += '<tr>';
        headers.forEach(header => tableBody += `<td>${row[header]}</td>`);
        tableBody += '</tr>';
    });

    document.getElementById('tableBody').innerHTML = tableBody;
}
