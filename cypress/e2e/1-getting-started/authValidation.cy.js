/// <reference types="Cypress" />

describe('Apple TV Login', () => {
    let auth_device_uri
    let device_code
    it('Send the auth request for token ', () => {
        cy.request({
            method: 'POST',
            url : 'https://acme-demo.auth0.com/oauth/device/code',
            body : {"client_id": "nZ8JDrV8Hklf3JumewRl2ke3ovPZn5Ho", "audience": "urn:my-videos", "scope": "offline_access+openid+profile"},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((response) => { 
                expect(response.status).is.equal(200)
                expect(response.body.expires_in).is.equal(900)
                expect(response.body.interval).is.equal(5)
                expect(response.body.verification_uri).is.equal("https://acme-demo.auth0.com/activate")
                auth_device_uri = response.body.verification_uri_complete
                device_code = response.body.device_code
                cy.log(response.body.verification_uri_complete)
                cy.log(response.body.device_code)
            })
    })
    it('Send the auth request for device ', () => {
        cy.request({
            failOnStatusCode: false,
            method: 'POST',
            url : 'https://acme-demo.auth0.com/oauth/token',
            body : {"client_id": "nZ8JDrV8Hklf3JumewRl2ke3ovPZn5Ho", 
                    "grant_type": "urn:ietf:params:oauth:grant-type:device_code", 
                    "device_code": device_code},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((response) => { 
                expect(response.status).is.equal(403)
                expect(response.body.error).is.equal("authorization_pending")
                expect(response.body.error_description).is.equal("User has yet to authorize device code.")
            })
    })
    it('Send the auth request for user ', () => {
        cy.log(auth_device_uri)
        cy.visit(auth_device_uri)
        cy.get('[value="confirm"]').click()
        cy.get('[name="username"]').type('testnetsiden@gmail.com')
        cy.get('[name="password"]').type('AppleTv#22',{log: false})
        cy.get('[name="action"]').click()
        cy.url().should('eq', 'https://acme-demo.auth0.com/device/success')
    })
})
