// react
import { useEffect, useState } from "react";

// toaster
import { toast } from "react-hot-toast";

// mui
import Button from "@mui/material/Button";

// icons
import { FaSadCry, FaTrophy } from "react-icons/fa";
import { MdKeyboardAlt } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";

// classes
import WebSocketService from "./WebSocketService";

// components
import NotificationProvider from "./components/NotificationProvider";

// interfaces
interface gameState {
  type: "gameOver" | "reset" | "start" | "fail" | "playerChoice";
  message: string;
  board: (number | null)[];
  winner: "PLAYER" | "COMPUTER" | "DRAW";
}

// core component
export default function App() {
  // states
  const [websocket] = useState(new WebSocketService("ws://localhost:8080"));
  const [gameState, setGameState] = useState<gameState>();
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [numOfUserWins, setNumOfUserWins] = useState<number>(0);
  const [numOfCpuWins, setNumOfCpuWins] = useState<number>(0);

  useEffect(
    function () {
      websocket.connect(setGameState);

      return () => {
        websocket.closeSocket();
      };
    },
    [websocket]
  );

  useEffect(
    function () {
      if (gameState?.type === "gameOver") {
        setIsGameOver(true);
        switch (gameState.winner) {
          case "COMPUTER":
            setNumOfCpuWins((prevWins) => prevWins + 1);
            toast.success("Computer won! better luck next Time", {
              icon: <FaSadCry />,
            });
            break;

          case "PLAYER":
            setNumOfUserWins((prevWins) => prevWins + 1);
            toast.success("You won!", {
              icon: <FaTrophy />,
            });
            break;

          case "DRAW":
            toast.success("It was a draw!", {
              icon: <FaSadCry color="inherit" />,
            });
            break;
        }
      }

      if (gameState?.type === "fail") {
        toast.error("This box has already choosen");
      }
    },
    [gameState]
  );

  // handlers
  // reset
  const resetGameHandler = () => {
    setIsGameOver(false);
    websocket.sendMessage({ message: null, type: "reset" });
    toast.success("The game was reset Successfully!");
  };

  // user choice
  const choiceHandler = (choosen: number) => {
    console.log(gameState?.board);

    if (isGameOver) {
      toast.error(`This game is already over. ${gameState?.winner} won!`);
      return;
    }

    if (gameState?.board && gameState?.board[choosen] !== null) {
      toast.error("This box is already choosen!");
      return;
    }

    websocket.sendMessage({
      type: "choice",
      message: choosen,
    });
  };

  // close socket
  const closeSocketHandler = () => {
    websocket.closeSocket();
  };

  // jsx
  return (
    <div className="w-full bg-rose-50 min-h-screen">
      <h1 className="left-0 right-0 static text-3xl font-medium text-center text-[24px] py-4 bg-rose-200 text-rose-950">
        COMPUTER NETWORKS
      </h1>
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex ">
          <div className="flex-[2] m-10 mt-10">
            <h2 className="text-center text-[24px] w-9/12 mx-auto border-red-100 border-b-2 pb-3 my-10 mb-12 text-rose-800 font-medium  relative">
              Tic Tac Toe
              <Button
                onClick={resetGameHandler}
                sx={{
                  borderRadius: "10px",
                  position: "absolute",
                  top: 2,
                  right: 0,
                  fontFamily: "inherit",
                  color: "#9f1239",
                  border: "1px solid #fecdd3",
                }}
              >
                reset
              </Button>
            </h2>
            <div className="w-9/12 m-auto">
              <div className="bg-white grid grid-cols-3 grid-rows-3 justify-center items-center content-center justify-items-center  Stext-center w-full border rounded-2xl border-rose-200 overflow-hidden">
                {gameState?.board?.map((data: number | null, index: number) => (
                  <div
                    onClick={() => choiceHandler(index)}
                    key={index + " " + Math.random()}
                    className={`p-2 h-[60px] sm:h-[60px] md:h-[100px] w-full text-rose-600 hover:bg-rose-500 hover:text-white transition cursor-pointer active:bg-rose-800
                      ${gameState?.type === "gameOver" && "cursor-not-allowed"}
                      ${[3, 4, 5].includes(index) && "border-y-2"}
                      ${[1, 4, 7].includes(index) && "border-x-2"}`}
                  >
                    <span className="h-full  sm:text-3xl md:text-4xl font-thin  flex items-center justify-center text-center">
                      {data === null ? " " : data}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`w-9/12 mx-auto mt-14 text-[18px] uppercase text-rose-500 text-center  py-2 px-5 border-y-2 border-rose-500 flex justify-center items-center gap-2 ${
                  (!gameState || !gameState.winner) && "hidden"
                }`}
              >
                {gameState?.winner === "DRAW" && "it was a draw"}
                {gameState?.winner === "COMPUTER" && (
                  <>
                    <FaSadCry size={30} className="text-rose-750" />
                    You Lost!
                  </>
                )}
                {gameState?.winner === "PLAYER" && (
                  <>
                    <FaTrophy size={30} className="text-rose-750" />
                    You Won!
                  </>
                )}
              </div>
            </div>
          </div>

          <aside className="flex-[1]  p-5 pr-16 flex flex-col text-center uppercase text-rose-800 ">
            <div className="flex-1 p-5">
              <h4 className="p-2 px-7 bg-rose-700 rounded-xl text-white font-semibold">
                results
              </h4>

              <div className="mt-10 text-left text-[14px]">
                <div className="p-2 px-7 bg-violet-700 rounded-xl text-white font-semibold flex justify-between mb-2">
                  <span>computer</span>
                  <span>{numOfCpuWins}</span>
                </div>
                <div className="p-2 px-7 bg-indigo-700 rounded-xl text-white font-semibold flex justify-between">
                  <span>player</span>
                  <span>{numOfUserWins}</span>
                </div>
              </div>
            </div>

            <div className="w-10/12 h-px bg-rose-500 mx-auto mb-9" />

            <div className="self-center w-11/12 p-3 bg-rose-600 rounded-xl overflow-hidden">
              <div className="mt-3 mb-2 bg-rose-200 text-rose-900 whitespace-nowrap p-2 rounded-xl flex flex-row-reverse items-center gap-3">
                <MdKeyboardAlt />
                <span className="font-bold">:برنامه نویس</span>
                امیر حسین حوری
              </div>
              <div className="bg-rose-200 text-rose-900  whitespace-nowrap p-2 rounded-xl flex flex-row-reverse items-center gap-3">
                <GiTeacher />
                <span className="font-bold">:استاد</span>
                دکتر چینی پرداز
              </div>
              <div className="mt-11 text-center bg-rose-100 text-rose-800  whitespace-nowrap p-2 rounded-xl  ">
                دانشگاه صنعتی جندی شاپور
              </div>
            </div>
          </aside>
        </div>
      </div>
      <NotificationProvider />
    </div>
  );
}
