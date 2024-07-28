import { DatasetWord } from "./dataset-word";
import { DatasetSection } from "./dataset-section";

export interface DatasetJson {
    sections: DatasetSection[];
    words: DatasetWord[];
}
