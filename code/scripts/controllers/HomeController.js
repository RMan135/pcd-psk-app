import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import ListModel from "../models/ListModel.js";

export default class HomeController extends ContainerController {

    constructor(element) {
        super(element);

        // List model
        this.listModel = new ListModel();

        // Set some default values for the view model
        this.model = this.setModel(this.listModel.toJSON());
        
        // Fetch data from EDFS and populate the view model
        this.listModel.hydrate(this.model);
    }
}