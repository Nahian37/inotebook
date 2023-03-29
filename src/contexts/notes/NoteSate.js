import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const notesInitial = [
        {
          "_id": "641be5cf5ad40ece02035e8c",
          "user": "64194e8fd133e822b91fcb16",
          "title": "Alarm",
          "description": "Wake up at 5:30",
          "tag": "personal",
          "date": "2023-03-23T05:38:23.169Z",
          "__v": 0
        },
        {
          "_id": "6423d41b03f91ef8d1436535",
          "user": "64194e8fd133e822b91fcb16",
          "title": "Alarm 2",
          "description": "Wake up at 6:30",
          "tag": "personal",
          "date": "2023-03-29T06:00:59.753Z",
          "__v": 0
        }
      ]
    const [notes, setNotes] = useState(notesInitial);
    return (
        <NoteContext.Provider value={{notes, setNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;