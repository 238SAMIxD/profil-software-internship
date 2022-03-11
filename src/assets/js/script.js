const containerUser = document.querySelector(".container-user");
const generateUserButton = document.querySelector(".container-button");
const adddressCheckbox = document.querySelector(".container-address__checkbox");
const errorText = document.querySelector(".container-error");
const loadingElement = document.querySelector(".container-loading");
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

    containerUser.style.display = "none";
    loadingElement.style.display = "flex";

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

            document.querySelector(".container-user__name-full").innerText = `${data.name.first} ${data.name.last}`;
            document.querySelector(".container-user__created").innerText = `Created: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            getLocation( data );

            let imageSrc = window.innerWidth > 600 ? data.picture.large : data.picture.medium;

            loadImage( imageSrc )
                .then( () => {
                    document.querySelector(".container-user__picture").style.backgroundImage = `url("${imageSrc}")`;
                    return imageSrc = getFlag( data.nat.toLowerCase() );
                })
                .then( imageSrc => loadImage( imageSrc ) )
                .then( () => {
                    document.querySelector(".container-user__name-nationality").style.backgroundImage = `url("${imageSrc}")`;

                    errorText.style.display = "none";
                    loadingElement.style.display = "none";
                    containerUser.style.display = "flex";
                });

            store( data );
        });
}

function getLocation( data ) {
    if( data.location === undefined ) {
        document.querySelector(".container-user__address-street").innerText = "hidden";
        document.querySelector(".container-user__address-city").innerText = null;
        document.querySelector(".container-user__address-country").innerText = null;
        return;
    };

    let location = data.location;

    document.querySelector(".container-user__address-street").innerText = `${location.street.name} ${location.street.number}`;
    document.querySelector(".container-user__address-city").innerText = `${location.postcode} ${location.city}`;
    document.querySelector(".container-user__address-country").innerText = location.country;
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

function getFlag( nat ) {
    return `https://flagpedia.net/data/flags/h80/${nat}.png`;
}

function loadImage( src ) {
    return new Promise( ( resolve, reject ) => {
        const image = new Image();

        image.addEventListener('load', resolve);
        image.addEventListener('error', reject);

        image.src = src;
    });
}