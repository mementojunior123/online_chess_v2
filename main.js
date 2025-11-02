// I also need to learn how to implement TS https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
//peerjs --port 5000 --key peerjs --path /
//This is for local testing when peerjs is down
console.log(0);
import {PieceTypes, Pieces, GameState, Players, ImageDict, GameResults} from "./chess_engine.js";
import { Peer, NetworkClient, global_id } from "./networking.js";
var network_client = null;
var is_host = null;
var game_is_over = false;
var board_flipped = false;
let x = window;

const game_state = new GameState();
var selected = null;
function tile_clicked_handler(event) {
    let hit = event.target;
    const prefix = "chess_tile_";
    let tile_id = hit.id;
    if (!tile_id.startsWith(prefix)) {
        return;
    }
    const coordinate_str = tile_id.slice(-3);
    const x = Number(coordinate_str[0]);
    const y = Number(coordinate_str[2]);

    const tile_query = '#' + prefix + coordinate_str;
    let tile = document.querySelector(tile_query);
    let background = document.querySelector(`${tile_query} .background_tile`);
    let foreground = document.querySelector(`${tile_query} .foreground`);

    const coord = GameState.visualToGame(x, y, board_flipped);
    const piece_at_square = game_state.accessSquare(...coord);
    const piece_color = GameState.getPieceColor(piece_at_square);
    if ((piece_at_square === Pieces.NONE || piece_color === Players.NONE) && selected === null) {return;}
    const tile_img_src = ImageDict[piece_at_square];
    if (tile_img_src === null) {
        foreground.classList.add("hidden"); // This shouldn't trigger
    } else {
        foreground.classList.remove("hidden");
        foreground.src = tile_img_src;
    }
    let already_highlighted = document.querySelectorAll('.highlighted_square');
    if (!event.ctrlKey && !game_is_over) {
        if (selected === null) {
            selected = coord;
            foreground.classList.add('highlighted_square');
        } else {
            const selected_piece_color = GameState.getPieceColor(game_state.accessSquare(...selected));
            if (selected[0] === coord[0] && selected[1] === coord[1]) {
                selected = null;
                already_highlighted.forEach((element) => {
                    element.classList.remove('highlighted_square');
                });
                return;
            }
            console.log(`(${selected}) --> (${coord})`);
            if (selected_piece_color !== game_state.playing_as && game_state.playing_as !== Players.NONE) {
                setTimeout(() => {show_move_illegal(10, "You cannot move your opponent's pieces!");}, 30);

            } else if (selected_piece_color !== game_state.turn) {
                setTimeout(() => {show_move_illegal(10, "It's not your turn!");}, 30);
            } else if (game_state.moveIsLegal(selected, coord)) {
                game_state.makeMove(selected, coord);
                hide_move_illegal(0);
                if (network_client !== null && game_state.playing_as !== Players.NONE) {
                    network_client.sendMessage(`MOVE ${selected[0]}-${selected[1]} ${coord[0]}-${coord[1]}`);
                }
                update_all();
            } else {
                setTimeout(() => {show_move_illegal(10, 'This move is illegal!');}, 30);
            }
            selected = null;
            already_highlighted.forEach((element) => {
                element.classList.remove('highlighted_square');
            });
        }
    } else {
        selected = null;
        already_highlighted.forEach((element) => {
                element.classList.remove('highlighted_square')
        });
    }
}

let host_button = document.querySelector("#host_button");
let join_button = document.querySelector("#join_button");
let network_status_paragraph = document.querySelector("#join_context");
let confirm_room_code_button = document.querySelector("#confirm_room_code_button");
let room_code_input_box = document.querySelector("#room_code_input");
let room_code_div = document.querySelector("#room_code_div");

function generate_room_code() { // Odds of room code collision are 1 in 3 quadrillion
    const lowercase_letters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase_letters = lowercase_letters.toUpperCase();
    const lookup_table = lowercase_letters + '0123456789';
    let room_code = '';
    for (let i = 0; i < 10; i++) {
        room_code += lookup_table[Math.floor(Math.random() * 36)];
    }
    return room_code

}

function validate_room_code(code) {
    if (!(typeof code === 'string' || code instanceof String)) {
        return;
    }
    const lowercase_letters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase_letters = lowercase_letters.toUpperCase();
    const lookup_table = lowercase_letters + '0123456789';
    if (code.length !== 10) {return false;}
    for (let i = 0; i < code.length; i++) {
        if (!lookup_table.includes(code[i])) {return false;}
    }
    return true;
}

function on_host_button_clicked() {
    if (network_client !== null) {return;}
    const room_code = generate_room_code();
    const prefix = 'ONLINE-CHESS-V2';
    const network_id = prefix + room_code;
    const noop = () => {};
    network_client = new NetworkClient(true, network_id, on_data_received, noop, noop, noop, 
        () => {setTimeout(() => {network_status_paragraph.textContent = "Connected! You are white."; 
            game_state.reset(); game_state.playing_as = Players.WHITE; update_all();
            }, 200);}
    );
    network_status_paragraph.textContent = `Hosting!\nRoom code : ${room_code}`;
    is_host = true;
    hide_buttons();
    hide_room_code_input_form();
}

function on_join_button_clicked() {
    if (room_code_div.classList.contains('hidden')) {
        show_room_code_input_form();
        return;
    } else {
        hide_room_code_input_form();
        return;
    }
}

function on_confirm_button_clicked() {
    if (network_client !== null) {return;}

    const inputted = room_code_input_box.value;
    const prefix = 'ONLINE-CHESS-V2';

    if (inputted === null) {show_move_illegal(10, 'This room code is invalid!'); return;}
    const room_code = inputted.toLowerCase();
    if (!validate_room_code(room_code)) {
        show_move_illegal(10, 'This room code is invalid!');
        return;
    }

    const network_id = prefix + room_code;
    const noop = () => {};
    network_client = new NetworkClient(false, network_id, on_data_received, noop, noop, noop, 
        () => {setTimeout(() => {network_status_paragraph.textContent = "Connected! You are black."; 
            game_state.reset(); game_state.playing_as = Players.BLACK; update_all(); 
            }, 200);}
    );
    setTimeout(() => {network_client.sendMessage('hi')}, 400);
    network_status_paragraph.textContent = "Joining...";
    is_host = false;
    hide_buttons();
    hide_room_code_input_form();
    hide_move_illegal(0.5);
}


function hide_buttons() {
    host_button.classList.add('hidden');
    join_button.classList.add('hidden');
    join_button.disabled = true;
    host_button.disabled = true; 
}

function show_room_code_input_form() {
    room_code_div.classList.remove('hidden');
}

function hide_room_code_input_form() {
    room_code_div.classList.add('hidden');
}
function on_data_received(data) {
    if (!(typeof data === 'string' || data instanceof String)) {
        return;
    }
    console.log(data);
    if (data.startsWith("MOVE")) {
        let [start_x, start_y, end_x, end_y] = [Number(data[5]), Number(data[7]), Number(data[9]), Number(data[11])];
        let other_color;
        if (game_state.playing_as === Players.NONE) {
            other_color = Players.NONE;
        } else if (game_state.playing_as === Players.WHITE) {
            other_color = Players.BLACK;
        } else {
            other_color = Players.WHITE;
        }
        if (!game_state.moveIsLegal([start_x, start_y], [end_x, end_y], other_color)) {
            network_client.sendMessage('Rejected move');
            return;
        }
        game_state.makeMove([start_x, start_y], [end_x, end_y]);
        hide_move_illegal(0);
        update_all();
        selected = null;
        let already_highlighted = document.querySelectorAll('.highlighted_square');
        already_highlighted.forEach((element) => {
                element.classList.remove('highlighted_square')
        }); 
    }
}

host_button.addEventListener('click', on_host_button_clicked);
join_button.addEventListener('click', on_join_button_clicked);
confirm_room_code_button.addEventListener('click', on_confirm_button_clicked);

let turn_order_text = document.querySelector('#turn_order');
let illegal_move_shower = document.querySelector('#illegal_move_shower');

function show_move_illegal(time, message = '') {
    illegal_move_shower.classList.remove('hidden');
    illegal_move_shower.textContent = message;
    hide_move_illegal(time);
}

function hide_move_illegal(delay) {
    setTimeout(() => {illegal_move_shower.classList.add('hidden')}, delay * 1000);
}

function update_all() {
    if (game_state.playing_as === Players.BLACK) {
        board_flipped = true;
    } else {
        board_flipped = false;
    }
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            update_tile(get_tile(x, y));
        }
    }
    const game_result = game_state.isGameOver();
    if (game_result === false) {
        game_is_over = false;
        if (game_state.turn === Players.WHITE) {
            turn_order_text.textContent = "White to play!";
        } else {
            turn_order_text.textContent = "Black to play!";
        }
    } else {
        game_is_over = true;
        if (game_result === GameResults.INSUFFICIENT_MATERIAL) {
            turn_order_text.textContent = "Draw by insufficient material!";
        } else if (game_result === GameResults.STALEMATE) {
            turn_order_text.textContent = "Draw by stalemate!";
        } else if (game_result === GameResults.INVALID_KING_COUNT) {
            turn_order_text.textContent = "Something went wrong. The game has ended!";
            show_move_illegal(999, "This board is invalid! (wrong amount of kings)");
        } else if (game_result === GameResults.CHECKMATE) {
            let winning_team;
            if (game_state.turn === Players.BLACK) {winning_team = "White";} else {winning_team = "Black";}
            turn_order_text.textContent = `Checkmate. ${winning_team} wins!`;
        } else {
            turn_order_text.textContent = "Something went wrong. The game has ended!";
            show_move_illegal(999, "An invalid game result has occured!");
        }
    }
}

function get_tile(x, y) {
    const prefix = "chess_tile_";
    const tile_query = '#' + prefix + `${x}-${y}`;
    return document.querySelector(tile_query);
}
function sddsfssasaffffa() {return;}

function update_tile(tile_div) {
    const prefix = "chess_tile_";
    let tile_id = tile_div.id;
    if (!tile_id.startsWith(prefix)) {
        return;
    }
    const coordinate_str = tile_id.slice(-3);
    const x = Number(coordinate_str[0]);
    const y = Number(coordinate_str[2]);
    
    const tile_query = '#' + prefix + coordinate_str;
    let tile = document.querySelector(tile_query);
    let background = document.querySelector(`${tile_query} .background_tile`);
    let foreground = document.querySelector(`${tile_query} .foreground`);
    if ((x + y) % 2 === 1) {
        background.src = "static/img/chess_set/black_tile.svg";
    } else {
        background.src = "static/img/chess_set/white_tile.svg";
    }
    const piece_at_square = game_state.accessSquare(...GameState.visualToGame(x, y, board_flipped));
    const tile_img_src = ImageDict[piece_at_square];
    if (tile_img_src === null) {
        foreground.classList.add("hidden");
    } else {
        foreground.classList.remove("hidden");
        foreground.src = tile_img_src;
    }
}

let board = document.querySelector(".board");

for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
        let new_div = document.createElement("div");

        let new_foreground = document.createElement("img");
        let background = document.createElement("img");

        new_foreground.width = 40;
        new_foreground.src = "static/img/chess_set/white_pieces/white_pawn.svg";

        background.width = 40;
        background.src = "static/img/chess_set/black_tile.svg";


        new_div.id = `chess_tile_${x}-${y}`;
        new_div.classList.add("tile");

        background.id = `chess_tile_background_${x}-${y}`;
        background.classList.add("background_tile");

        new_foreground.id = `chess_tile_foreground_${x}-${y}`;
        new_foreground.classList.add("foreground");

        new_div.addEventListener("click", tile_clicked_handler);
        board.appendChild(new_div);
        new_div.appendChild(background);
        new_div.appendChild(new_foreground);
        setTimeout(() => {update_tile(new_div)}, 50)
    }
}
