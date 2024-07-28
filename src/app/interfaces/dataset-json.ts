import { DatasetItem } from "./dataset-item";
import { DatasetSection } from "./dataset-section";

export interface DatasetJson {
    sections: DatasetSection[];
    words: DatasetItem[];
}
