const containerData = document.querySelector(".container-data");
const generateUserButton = document.querySelector(".container-button");
const adddressCheckbox = document.querySelector(".container-address__checkbox");
const errorText = document.querySelector(".container-error");
const containerTable = document.querySelector(".container-table");

switch( document.body.id ) {
    case "index":
        loadIndex();
        break;
    case "table":
        loadTable();
        break;
}

function loadIndex() {
    generateUserButton.onclick = generateUserFromUrl;
}

function loadTable() {

}

async function generateUserFromUrl( e ) {
    let url = e.target.dataset.url;

    if( adddressCheckbox.checked ) url += ",location";

    fetchData( url );
}

async function fetchData( url ) {
    fetch( url )
        .then( response => response.json() )
        .then( json => { return json.results[0]; } )
        .then( data => {
            if( data === undefined || data.error !== undefined ) {
                errorText.style.display = "block";
                return errorText.innerText = data ? data.error : "Unexpected error, try again later";
            }

            let date = new Date( data.registered.date );

            document.querySelector(".container-data__firstName > .data").innerText = data.name.first;
            document.querySelector(".container-data__lastName > .data").innerText = data.name.last;
            document.querySelector(".container-data__picture").style.backgroundImage = `url(${data.picture.large}`;
            document.querySelector(".container-data__registerDate > .data").innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            document.querySelector(".container-data__nationality > .data").innerText = data.nat;
            getLocation( data );

            errorText.style.display = "none";
            containerData.style.display = "block";

            store( data );
        });
}

function getLocation( data ) {
    if( data.location === undefined ) {
        document.querySelector(".container-data__address-street").innerText = "hidden";
        document.querySelector(".container-data__address-city").innerText = null;
        document.querySelector(".container-data__address-country").innerText = null;
    };

    let location = data.location;

    document.querySelector(".container-data__address-street").innerText = `${location.street.name} ${location.street.number}`;
    document.querySelector(".container-data__address-city").innerText = `${location.postcode} ${location.city}`;
    document.querySelector(".container-data__address-country").innerText = location.country;
}

function store( data ) {
    if( !data ) return;

    let dataArray = [];
    dataArray.push( data );

    if( localStorage.length === 0 || localStorage.getItem("random-data") === null ) return localStorage.setItem( "random-data", JSON.stringify( dataArray ) );

    dataArray = JSON.parse( localStorage.getItem("random-data") ).concat( dataArray );
    
    if( dataArray.length > 10 ) dataArray.shift();

    localStorage.setItem( "random-data", JSON.stringify( dataArray ) );
}