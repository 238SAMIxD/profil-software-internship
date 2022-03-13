const containerUser = document.querySelector(".container-user");
const generateUserButton = document.querySelector(".container-button");
const adddressCheckbox = document.querySelector(".container-address__checkbox");
const errorText = document.querySelector(".container-error");
const loadingElement = document.querySelector(".container-loading");
const containerTable = document.querySelector(".container-table");
const sortByList = Array.from( document.querySelectorAll("[data-value]") );
const sortCheckboxes = Array.from( document.querySelectorAll(".container-table__header-checkbox") );

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
    window.onload = loadDataFromLocalStorage;

    sortByList.forEach( element => {
        element.onclick = sortTable;
    });
}

function generateUserFromUrl( e ) {
    let url = e.target.dataset.url;

    if( adddressCheckbox.checked ) url += ",location";

    containerUser.style.display = "none";
    loadingElement.style.display = "flex";

    fetchData( url );
}

function fetchData( url ) {
    fetch( url )
        .then( response => response.json() )
        .then( json => { return json.results[0]; } )
        .then( data => {
            if( data === undefined || data.error !== undefined ) {
                errorText.style.display = "block";
                return errorText.innerText = data ? data.error : "Unexpected error, try again later";
            }

            const date = new Date( data.registered.date );

            document.querySelector(".container-user__name-full").innerText = `${data.name.first} ${data.name.last}`;
            document.querySelector(".container-user__created").innerText = `Created: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            document.querySelector(".container-user__name-nationality").dataset.nat = data.nat;
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

        image.addEventListener( 'load', resolve );
        image.addEventListener( 'error', reject );

        image.src = src;
    });
}

function loadData( data ) {
    const itemClassName = "container-table__item";

    if( data === null ) return containerTable.append("No data to show.");
    
    data.forEach( async element => {
        const date = new Date( element.registered.date );
        let countries;

        await await fetch("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-2/slim-2.json").then( response => response.json() ).then( json => countries = json );
        
        let row = document.createElement("div");
        let firstName = document.createElement("div");
        let lastName = document.createElement("div");
        let registrationDate = document.createElement("div");
        let country = document.createElement("div");

        row.className = "container-table__item table-row";
        firstName.classList.add( itemClassName, "table-firstName" );
        firstName.dataset.label = "First Name";
        lastName.classList.add( itemClassName, "table-lastName" );
        lastName.dataset.label = "Last Name";
        country.classList.add( itemClassName, "table-country" );
        country.dataset.label = "Country";
        registrationDate.classList.add( itemClassName, "table-registrationDate" );
        registrationDate.dataset.label = "Registration Date";

        firstName.innerText = element.name.first;
        lastName.innerText = element.name.last;
        country.innerText = countries.reduce( ( final, next ) => { return element.nat == next['alpha-2'] ? next.name : final } );
        registrationDate.innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        row.append( firstName, lastName, country, registrationDate );
        containerTable.appendChild( row );
    });
}

function loadDataFromLocalStorage( e ) {
    const data = JSON.parse( localStorage.getItem("random-data") );
    const sortedBy = JSON.parse( localStorage.getItem("sortedBy") ) || [ null, null ];
    const checkbox = sortCheckboxes.reduce( ( toSearch, checkbox ) => { return checkbox.className.includes( sortedBy.column ) ? checkbox : toSearch } );
    const label = document.querySelector(`label[data-value=${sortedBy.column}-${sortedBy.parameter}]`);

    loadData( sortData( data, sortedBy.column, sortedBy.parameter ) );

    if( label ) {
        checkbox.checked = sortedBy.parameter != "asc";
        label.dataset.value = sortedBy.column.concat( "-", ( sortedBy.parameter == "asc" ? "desc" : "asc" ) );
        label.parentElement.style.opacity = "0.75"
    }
}

function sortData( data, column, parameter ) {
    switch( column ) {
        case "lastName":
            data.sort( ( item1, item2 ) => {
                return parameter == "asc" ? item1.name.last.localeCompare( item2.name.last ) : item2.name.last.localeCompare( item1.name.last );
            });
            break;
        case "registrationDate":
            data.sort( ( item1, item2 ) => {
                return parameter == "asc" ? new Date( item1.registered.date ) - new Date( item2.registered.date ) : new Date( item2.registered.date ) - new Date( item1.registered.date );
            });
            break;
    }

    return data;
}

function sortTable( e ) {
    const [ column, parameter ] = e.target.dataset.value.split('-');
    const elements = Array.from( document.querySelectorAll(".container-table__item.table-row") );
    const data = JSON.parse( localStorage.getItem("random-data") );
    const checkbox = sortCheckboxes.reduce( ( toSearch, checkbox ) => { return checkbox.className.includes( column ) ? checkbox : toSearch } );
    const label = document.querySelector(`label[data-value=${column}-${parameter}]`);
    
    elements.forEach( element => {
        element.remove();
    });

    document.querySelectorAll("label[data-value]").forEach( element => { element.parentElement.style.opacity = "1" } );
    label.parentElement.style.opacity = "0.75";

    let sortedData = sortData( data, column, parameter );

    checkbox.checked = parameter != "asc";
    label.dataset.value = column.concat( "-", ( parameter == "asc" ? "desc" : "asc" ) );

    loadData( sortedData );

    localStorage.setItem( "sortedBy", JSON.stringify( { column, parameter } ) );
}