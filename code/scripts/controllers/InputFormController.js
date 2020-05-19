import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import ListModel from "../models/ListModel.js";

let model = {
    sectionTitle: {
        label: "New post"
    },
    title: {
        label: "Title",
        name: "name",
        required: true,
        placeholder: "Title here...",
        value: ''
    },
    content: {
        label: "Description",
        name: "email",
        required: true,
        placeholder: "Description here...",
        value: ''
    },
    file: {
        value: ''
    }
};

var temp_img = ""

function saveFile(file, callback) {

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        temp_img = reader.result;
        return(reader.result);
    }
    reader.onerror = error => reject(error);

}

export default class InputFormController extends ContainerController {
    constructor(element) {
        super(element);
        this.model = this.setModel(model);

        // List model
        this.listModel = new ListModel();
        this.tempModel = this.listModel.toJSON();
        this.listModel.hydrate(this.tempModel);

        console.log(this.tempModel)

        this.on("update-avatar", (event) => {
            saveFile(event.data[0], (result) => {
                this.model.file.value = result;
            });
        });

        // Triggered by pressing the "Send Data" button
        this.on('onSubmit', (e) => {
            var dataToSave = {
                title: this.model.title.value,
                description: { label: this.model.content.value },
                image: this.model.file.value
            };
            if (dataToSave.image === "") {
                dataToSave.image = temp_img;
            }

            console.log('initial', this.tempModel)
            this.tempModel.entities.push(dataToSave);
            console.log('saved', this.tempModel)
            this.listModel.save(this.tempModel);
        });
    }
}