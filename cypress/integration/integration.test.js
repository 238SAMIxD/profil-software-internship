describe("Desktop Tests", () => {
    describe("First time on page", () => {
        beforeEach(() => {
            cy.viewport( 1200, 800 );
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should see a table page", () => {
            cy.get("[href='table.html']").click();
            cy.get(".header-subtitle").should("have.text", "RandomUser data presentation");
        });

        it("should see a blank table", () => {
            cy.get(".container-table p").should("have.text", "No data to show.");
        });
    });

    describe("Generating 5 users", () => {
        before(() => {
            cy.clearLocalStorageSnapshot();
        });

        beforeEach(() => {
            cy.viewport( 1200, 800 );
            cy.restoreLocalStorage();
        });

        afterEach(() => {
            cy.saveLocalStorage();
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should click button 5 times", () => {
            for(let i = 0; i < 5; i++) {
                cy.contains("Generate User").click();
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
            
                cy.wait( 100 );
            }
        });

        it("should see a table page", () => {
            cy.get("[href='table.html']").click();
            cy.get(".header-subtitle").should("have.text", "RandomUser data presentation");
        });

        it("should see data in table", () => {
            cy.get(".container-table").children(".container-table__item").should( "have.length", 5 );
        });
    });

    describe("Sorting results", () => {
        before(() => {
            cy.clearLocalStorageSnapshot();
        });

        beforeEach(() => {
            cy.viewport( 1200, 800 );
            cy.restoreLocalStorage();
        });

        afterEach(() => {
            cy.saveLocalStorage();
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should click button 15 times", () => {
            for(let i = 0; i < 15; i++) {
                cy.contains("Generate User").click();
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
            
                cy.wait( 100 );
            }
        });

        it("should see a table page", () => {
            cy.get("[href='table.html']").click();
            cy.get(".header-subtitle").should("have.text", "RandomUser data presentation");
        });

        it("should see last 10 users in table", () => {
            cy.wait( 100 );
            cy.get(".container-table").children(".container-table__item").should( "have.length", 10 );
        });

        it("should sort the data by Registration Date", async () => {
            let lastValue;
            cy.get("label[data-value=registrationDate-asc]").click();
            cy.wait( 500 );
            lastValue = await cy.get(".container-table__item.table-row").last().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); lastValue.push( Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) ) } );
            cy.get(".container-table__item.table-row").first().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); return Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) } ).should("be.lte", lastValue );
            
            cy.get("label[data-value=registrationDate-desc]").click();
            cy.wait( 500 );
            lastValue = await cy.get(".container-table__item.table-row").last().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); lastValue.push( Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) ) } );
            cy.get(".container-table__item.table-row").first().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); return Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) } ).should("be.gte", lastValue );
        });

        it("should sort the data by Last Name", () => {
            cy.get("label[data-value=lastName-asc]").click();
            cy.wait( 500 );
            cy.get('.table-lastName').then( elements => {
                let strings = [];
                elements.each( ( e, value ) => { strings.push( value.innerText ) } );
                cy.wrap( strings ).should( "equal", strings.sort( ( text1, text2 ) => { return text1.localeCompare( text2 ) } ) );
            });
            
            cy.get("label[data-value=lastName-desc]").click();
            cy.wait( 500 );
            cy.get('.table-lastName').then(elements => {
                
                let strings = [];
                elements.each( ( e, value ) => { strings.push( value.innerText ) } );
                cy.wrap( strings ).should( "equal", strings.sort( ( text1, text2 ) => { return text2.localeCompare( text1 ) } ) );
            });
        });
    });

    describe("Generate users with showed and hidden address", () => {
        before(() => {
            cy.clearLocalStorageSnapshot();
        });

        beforeEach(() => {
            cy.viewport( 1200, 800 );
            cy.restoreLocalStorage();
        });

        afterEach(() => {
            cy.saveLocalStorage();
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should generate user", () => {
                cy.contains("Generate User").click();
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
                cy.wait( 1000 );
                cy.get(".container-user__address-street").should("not.have.text", "hidden");
        });

        it("should generate user with hidden address", () => {
                cy.contains("Hide address").click();
                cy.contains("Generate User").click();
                cy.wait( 1000 );
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
                cy.get(".container-user__address-street").should("have.text", "hidden");
        });
    });
});

describe("Mobile Tests", () => {
    describe("First time on page", () => {
        beforeEach( () => {
            cy.viewport( 700, 1000 );
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should see a table page", () => {
            cy.get(".navbar-label").focus();
            cy.wait( 100 );
            cy.get("[href='table.html']").click();
            cy.get(".header-subtitle").should("have.text", "RandomUser data presentation");
        });

        it("should see a blank table", () => {
            cy.get(".container-table p").should("have.text", "No data to show.");
        });
    });

    describe("Generating 5 users", () => {
        before(() => {
            cy.clearLocalStorageSnapshot();
        });

        beforeEach(() => {
            cy.viewport( 700, 1000 );
            cy.restoreLocalStorage();
        });

        afterEach(() => {
            cy.saveLocalStorage();
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should click button 5 times", () => {
            for(let i = 0; i < 5; i++) {
                cy.contains("Generate User").click();
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
            
                cy.wait( 100 );
            }
        });

        it("should see a table page", () => {
            cy.get(".navbar-label").focus();
            cy.wait( 100 );
            cy.get("[href='table.html']").click();
            cy.get(".header-subtitle").should("have.text", "RandomUser data presentation");
        });

        it("should see data in table", () => {
            cy.get(".container-table").children(".container-table__item").should( "have.length", 5 );
        });
    });

    describe("Sorting results", () => {
        before(() => {
            cy.clearLocalStorageSnapshot();
        });

        beforeEach(() => {
            cy.viewport( 700, 1000 );
            cy.restoreLocalStorage();
        });

        afterEach(() => {
            cy.saveLocalStorage();
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should click button 15 times", () => {
            for(let i = 0; i < 15; i++) {
                cy.contains("Generate User").click();
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
            
                cy.wait( 100 );
            }
        });

        it("should see a table page", () => {
            cy.get(".navbar-label").focus();
            cy.wait( 100 );
            cy.get("[href='table.html']").click();
            cy.get(".header-subtitle").should("have.text", "RandomUser data presentation");
        });

        it("should see last 10 users in table", () => {
            cy.get(".container-table").children(".container-table__item").should( "have.length", 10 );
        });

        it("should sort the data by Registration Date", async () => {
            let lastValue;
            cy.get(".container-sort__button-label").click();
            cy.wait( 100 );

            cy.get("div[data-value=registrationDate-asc]").click();
            cy.wait( 500 );
            lastValue = await cy.get(".container-table__item.table-row").last().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); lastValue.push( Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) ) } );
            cy.get(".container-table__item.table-row").first().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); return Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) } ).should("be.lte", lastValue );
            
            cy.get("div[data-value=registrationDate-desc]").click();
            cy.wait( 500 );
            lastValue = await cy.get(".container-table__item.table-row").last().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); lastValue.push( Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) ) } );
            cy.get(".container-table__item.table-row").first().children(".table-registrationDate").invoke("text").then( text => { let temp = text.split(" "); let date = temp[0].split("."); let time = temp[1].split(":"); return Date.parse( date[2], date[1]-1, date[0], time[0], time[1], time[2] ) } ).should("be.gte", lastValue );
        });

        it("should sort the data by Last Name", () => {
            let lastValue;
            cy.get(".container-sort__button-label").click();
            cy.wait( 100 );
            
            cy.get("div[data-value=lastName-asc]").click();
            cy.wait( 500 );
            cy.get('.table-lastName').then( elements => {
                let strings = [];
                elements.each( ( e, value ) => { strings.push( value.innerText ) } );
                cy.wrap( strings ).should( "equal", strings.sort( ( text1, text2 ) => { return text1.localeCompare( text2 ) } ) );
            });
            
            cy.get("div[data-value=lastName-desc]").click();
            cy.wait( 500 );
            cy.get('.table-lastName').then(elements => {
                let strings = [];
                elements.each( ( e, value ) => { strings.push( value.innerText ) } );
                cy.wrap( strings ).should( "equal", strings.sort( ( text1, text2 ) => { return text2.localeCompare( text1 ) } ) );
            });
        });
    });

    describe("Generate users with showed and hidden address", () => {
        before(() => {
            cy.clearLocalStorageSnapshot();
        });

        beforeEach(() => {
            cy.viewport( 700, 1000 );
            cy.restoreLocalStorage();
        });

        afterEach(() => {
            cy.saveLocalStorage();
        });

        it("should see an index page", () => {
            cy.visit("/public/");
            cy.get(".header-subtitle").should("have.text", "RandomUser API communication");
        });

        it("should generate user", () => {
                cy.contains("Generate User").click();
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
                cy.wait( 1000 );
                cy.get(".container-user__address-street").should("not.have.text", "hidden");
        });

        it("should generate user with hidden address", () => {
                cy.contains("Hide address").click();
                cy.contains("Generate User").click();
                cy.wait( 1000 );
                cy.get( ".container-user", { timeout: 3000 } ).should("be.visible");
                cy.get(".container-user__address-street").should("have.text", "hidden");
        });
    });
});