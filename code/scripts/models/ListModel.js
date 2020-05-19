export default class ListModel {

    constructor() {
        this.data = {
            entities: [], // holds all the entities of the list
        };
    }

    /**
    * Fetch data from EDFS and populate the view model
    */
    hydrate(model) {
        // We're getting the data through the Download
        // middleware of the Service Worker
        return fetch('/download/data/list.json')
            .then((response) => {
                if (!response.ok) {
                    return;
                }

                return response.json().then((data) => {
                    model.entities = data.entities;
                    console.log('fetched data', model.entities)
                })
            })
            .catch((err) => {
                console.error(err);
            })

    }

    /**
    * Save the model to EDFS
    */
    save(data) {
        console.log("saving data", data)
        this.data.entities = data.entities;

        const listFile = new File([JSON.stringify(this.data)], 'list.json');

        // We're using the Upload middleware of the Service Worker
        // to upload data to EDFS.
        const saveEndpointUrl = `/upload?path=/data&filename=${listFile.name}`;

        return fetch(saveEndpointUrl, {
            method: 'POST',
            body: listFile
        }).then((response) => {
            return this.getJsonResponseBody(response).then((data) => {
                if (!response.ok || response.status != 201) {
                    return Promise.reject("Unable to save list");
                }

                return Promise.resolve();
            })
        })
    }

    saveSingleObject(item) {
        console.log("saving single item", item)
        this.data.entities.push(item);
        console.log("=>", this.data.entities)
        const listFile = new File([JSON.stringify(this.data)], 'list.json');

        // We're using the Upload middleware of the Service Worker
        // to upload data to EDFS.
        const saveEndpointUrl = `/upload?path=/data&filename=${listFile.name}`;

        return fetch(saveEndpointUrl, {
            method: 'POST',
            body: listFile
        }).then((response) => {
            return this.getJsonResponseBody(response).then((data) => {
                if (!response.ok || response.status != 201) {
                    return Promise.reject("Unable to save list");
                }

                return Promise.resolve();
            })
        })
    }

    getJsonResponseBody(response) {
        return response.json((result) => {
            return result;
        }).catch((err) => {
            return Promise.resolve({});
        })
    };

    /**
    * Return a copy of the data
    */
    toJSON() {
        return JSON.parse(JSON.stringify(this.data));
    }
}