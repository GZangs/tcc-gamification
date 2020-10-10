import React, { useEffect, useState } from "react";
import Board from "@lourenci/react-kanban";
import axios from "axios";
import { useTranslation } from "react-i18next";

import "@lourenci/react-kanban/dist/styles.css";
import "./kanban_style.css";
import { Button } from "antd";

const fetcher = axios.create({
  baseURL: "/api/task",
});

const KanbanBoard = ({
  allowRemoveCard,
  allowAddCard,
  projectId,
  columns = ["todo", "doing", "done"],
}) => {
  const { t } = useTranslation();
  const [todo, setTodo] = useState([]);
  const [doing, setDoing] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    fetcher
      .get(`/project/${projectId}/task/todo`)
      .then((data) => {
        console.log(data);
        setTodo(data); //TODO: Testar essa merda aqui
      })
      .catch((err) => console.error);

    fetcher
      .get(`/project/${projectId}/task/doing`)
      .then((data) => {
        setTodo(data); //TODO: Testar essa merda aqui
      })
      .catch((err) => console.error);

    fetcher
      .get(`/project/${projectId}/task/done`)
      .then((data) => {
        setTodo(data); //TODO: Testar essa merda aqui
      })
      .catch((err) => console.error);
  }, []);

  const [board, setBoard] = useState({
    columns: columns.map((c) => {
      fetcher.get();
      return {
        id: c,
        title: t(`kanban_board.${c}`),
        cards: [
          {
            id: 1,
            title: "Card title 1",
            description: "Card content",
          },
          {
            id: 2,
            title: "Card title 2",
            description: "Card content",
          },
          {
            id: 3,
            title: "Card title 3",
            description: "Card content",
          },
        ],
      };
    }),
  });

  const boardExample = {
    columns: [
      {
        id: "todo",
        title: t("kanban_board.todo"),
        cards: [
          {
            id: 1,
            title: "Card title 1",
            description: "Card content",
          },
          {
            id: 2,
            title: "Card title 2",
            description: "Card content",
          },
          {
            id: 3,
            title: "Card title 3",
            description: "Card content",
          },
        ],
      },
      {
        id: "doing",
        title: t("kanban_board.doing"),
        cards: [
          {
            id: 9,
            title: "Card title 9",
            description: "Card content",
          },
        ],
      },
      {
        id: "done",
        title: t("kanban_board.done"),
        cards: [
          {
            id: 12,
            title: "Card title 12",
            description: "Card content",
          },
          {
            id: 13,
            title: "Card title 13",
            description: "Card content",
          },
        ],
      },
    ],
  };

  const onNewCardConfirm = (draftCard) => ({
    id: new Date().getTime(),
    ...draftCard,
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          style={{ width: "27.2em" }}
          onClick={() =>
            board.columns[0].cards.push({
              id: 4,
              title: "Card title 3",
              description: "Card content",
            })
          }
        >
          ADD
        </Button>
      </div>
      <Board
        initialBoard={board}
        disableColumnDrag
        allowRemoveCard={allowRemoveCard}
        allowAddCard={allowAddCard ? { on: "top" } : false}
        onCardRemove={console.log}
        onNewCardConfirm={onNewCardConfirm}
        onCardNew={console.log}
      />
    </>
  );
};

export default KanbanBoard;
