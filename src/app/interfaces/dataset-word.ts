export interface DatasetWord {
    word_index: number;
    word_label: string;
    section_index: number;
    frames_count?: number;
    hand_landmark_frames?: string[];
    webcam_frames?: string[];
    word_gif?: string;
}
