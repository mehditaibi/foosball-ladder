import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Container,
  ListItem,
  List,
  ListItemText,
  Typography,
} from "@material-ui/core";

const getNames = () =>
  ["Cameron", "Aaron", "RJ", "Wes", "Rene", "Taj", "Mehdi"].map((name) => ({
    id: `item-${name}`,
    content: name,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle, index) => {
  let backgroundColor = "";
  if (index == "0") {
    backgroundColor = "#FFD700";
  } else if (index == "1") {
    backgroundColor = "#c0c0c0";
  } else if (index == "2") {
    backgroundColor = "#CD7F32";
  } else {
    backgroundColor = "#FFFFFF";
  }
  return {
    userSelect: "none",
    padding: 4,
    margin: `0 0 ${4}px 0`,
    borderRadius: "5px",
    textAlign: "center",
    border: "solid 1px #005687",
    color: "#005687",
    background: backgroundColor,
    ...draggableStyle,
  };
};

const getListStyle = (isDraggingOver) => ({
  background: "#FFFFFF",
  padding: 4,
  width: 250,
  border: "solid 1px #005687",
  margin: "20px auto",
  borderRadius: "5px",
});

function addName(data) {
  return fetch("/.netlify/functions/names-create", {
    body: JSON.stringify(data),
    method: "POST",
  }).then((response) => {
    return response.json();
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getNames(),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  render() {
    return (
      <Container>
        <Typography
          variant="h3"
          style={{
            textAlign: "center",
            fontFamily: "Helvetica",
            fontWeight: "bold",
            margin: "20px 0",
          }}
        >
          Foosball Ladder
        </Typography>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <List
                  dense={true}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            index
                          )}
                        >
                          <ListItemText>{item.content}</ListItemText>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    );
  }
}

export default App;
