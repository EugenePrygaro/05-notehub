enum NoteTag {
    Work = "Work",
    Personal = "Personal",
    Meeting = "Meeting",
    Shopping = "Shopping",
    Todo = "Todo",
}

interface Note {
    id?: string;
    title: string;
    content: string;
    tag: NoteTag;
}

export type { Note };
export { NoteTag };