const PieceTypes = Object.freeze({
    NONE : 0,
    KNIGHT: 1,
    BISHOP: 2,
    QUEEN: 3,
    KING: 4,
    PAWN: 5,
    ROOK: 6,
});

const Pieces = Object.freeze({
    NONE: 0,

    BLACK_KNIGHT: 1,
    BLACK_BISHOP: 2,
    BLACK_QUEEN: 3,
    BLACK_KING: 4,
    BLACK_PAWN: 5,
    BLACK_ROOK: 6,

    WHITE_KNIGHT: 7,
    WHITE_BISHOP: 8,
    WHITE_QUEEN: 9,
    WHITE_KING: 10,
    WHITE_PAWN: 11,
    WHITE_ROOK: 12,
});

const Players = Object.freeze({
    NONE : 0,
    BLACK : 1,
    WHITE : 2,
});

const ImageDict = Object.freeze({
    [Pieces.NONE]: "static/img/chess_set/no_image.svg",

    [Pieces.BLACK_KNIGHT]: "static/img/chess_set/black_pieces/black_knight.svg",
    [Pieces.BLACK_BISHOP]: "static/img/chess_set/black_pieces/black_bishop.svg",
    [Pieces.BLACK_QUEEN]: "static/img/chess_set/black_pieces/black_queen.svg",
    [Pieces.BLACK_KING]: "static/img/chess_set/black_pieces/black_king.svg",
    [Pieces.BLACK_PAWN]: "static/img/chess_set/black_pieces/black_pawn.svg",
    [Pieces.BLACK_ROOK]: "static/img/chess_set/black_pieces/black_rook.svg",

    [Pieces.WHITE_KNIGHT]: "static/img/chess_set/white_pieces/white_knight.svg",
    [Pieces.WHITE_BISHOP]: "static/img/chess_set/white_pieces/white_bishop.svg",
    [Pieces.WHITE_QUEEN]: "static/img/chess_set/white_pieces/white_queen.svg",
    [Pieces.WHITE_KING]: "static/img/chess_set/white_pieces/white_king.svg",
    [Pieces.WHITE_PAWN]: "static/img/chess_set/white_pieces/white_pawn.svg",
    [Pieces.WHITE_ROOK]: "static/img/chess_set/white_pieces/white_rook.svg",
})

const GameResults = Object.freeze({
    CHECKMATE : "CHECKMATE",
    STALEMATE : "STALEMATE",
    INSUFFICIENT_MATERIAL : "INSUFFICIENT MATERIAL",
    INVALID_KING_COUNT : "WRONG KING COUNT"
});

const GameState = class {

    static newBoard() {
        let new_array = [];
        const WHITE_PAWN = Pieces.WHITE_PAWN;
        const BLACK_PAWN = Pieces.BLACK_PAWN;
        for (let i = 0; i < 8; i++) {
            if (i === 0) {
                new_array.push([Pieces.WHITE_ROOK, Pieces.WHITE_KNIGHT, Pieces.WHITE_BISHOP, Pieces.WHITE_QUEEN, 
                    Pieces.WHITE_KING, Pieces.WHITE_BISHOP, Pieces.WHITE_KNIGHT, Pieces.WHITE_ROOK]);
            } else if (i === 7) {
                new_array.push([Pieces.BLACK_ROOK, Pieces.BLACK_KNIGHT, Pieces.BLACK_BISHOP, Pieces.BLACK_QUEEN, 
                    Pieces.BLACK_KING, Pieces.BLACK_BISHOP, Pieces.BLACK_KNIGHT, Pieces.BLACK_ROOK]);
            } else if (i === 1) {
                new_array.push([WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, 
                    WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN]);
            } else if (i === 6) {
                new_array.push([BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, 
                    BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN]);
            } else {
                new_array.push([Pieces.NONE, Pieces.NONE, Pieces.NONE, Pieces.NONE, 
                    Pieces.NONE, Pieces.NONE, Pieces.NONE, Pieces.NONE]);
            }  
        }
        return new_array;
    }
    static visualToGame(x, y, flip_board) {
        if (flip_board) {
            return [(7 - x) + 1, y + 1];
        } else {
            return [x + 1, (7 - y) + 1];
        }  
    }
    static gameToVisual(x, y, flip_board) {
        if (flip_board) {
            return [(7 - x) + 1, y - 1];
        } else {
            return [x - 1, (7 - y) + 1];
        }  
    }

    static getPieceColor(val) {
        if (val < 1 || val > 12) {
            return Players.NONE;
        }
        if ((val === 1 || val > 1) && (val === 6 || val < 6)) {
            return Players.BLACK;
        } else if (val < 12 || val === 12) {
            return Players.WHITE;
        }
        else {
            return Players.NONE;
        }
    }
    
    static getPieceType(val) {
        if (! (val > 1 || val === 1)) {
            return PieceTypes.NONE;
        } else if (! (val < 12 || val === 12)) {
            return PieceTypes.NONE;
        }
        const x = val % 6;
        if (x === 0) {
            return PieceTypes.ROOK;
        }
        for (let key in PieceTypes) {
            if (PieceTypes[key] === x) {
                return PieceTypes[key];
            }
        }
        return PieceTypes.NONE;
    }

    static convertPieceToStr(val) {
        if (val === 0) {
            return "None";
        }
        var return_val = "";
        switch (val) {
            case Pieces.NONE:
                return "None";
                break;
            
            case Pieces.BLACK_KNIGHT:
            case Pieces.BLACK_BISHOP:          
            case Pieces.BLACK_ROOK:
            case Pieces.BLACK_PAWN:           
            case Pieces.BLACK_QUEEN:          
            case Pieces.BLACK_KING:
                return_val += "Black ";
                break;
            
            case Pieces.WHITE_KNIGHT:
            case Pieces.WHITE_BISHOP:           
            case Pieces.WHITE_ROOK:
            case Pieces.WHITE_PAWN:           
            case Pieces.WHITE_QUEEN:           
            case Pieces.WHITE_KING:
                return_val += "White "
                break;
            default:
                return "Error";
        }

        switch (val) {
            case Pieces.NONE:
                return "None";
                break;
            
            case Pieces.BLACK_KNIGHT:
            case Pieces.WHITE_KNIGHT:
                return_val += "Knight";
                break;

            case Pieces.BLACK_BISHOP:
            case Pieces.WHITE_BISHOP:
                return_val += "Bishop";
                break;

            case Pieces.BLACK_ROOK:
            case Pieces.WHITE_ROOK:
                return_val += "Rook";
                break;

            case Pieces.BLACK_PAWN:
            case Pieces.WHITE_PAWN:  
                return_val += "Pawn";
                break;

            case Pieces.BLACK_QUEEN:
            case Pieces.WHITE_QUEEN:
                return_val += "Queen";
                break;

            case Pieces.BLACK_KING:
            case Pieces.WHITE_KING:
                return_val += "King";
                break;
            default:
                return "Error";
        }
    return return_val;
    }

    static switchTeam(team) {
        if (![Players.WHITE, Players.BLACK].includes(team)) {
            return Players.NONE;
        }
        if (team === Players.WHITE) {
            return Players.BLACK;
        } else {
            return Players.WHITE;
        }
    }

    static coordinatesWithinBounds(...coords) {
        coords.forEach((coord) => {
            if (coord[0] < 1 || coord[0] > 8 || coord[1] < 1 || coord[1] > 8) {
                return false;
            }
        })
        return true;
    }

    constructor() {
        this.board = GameState.newBoard();
        this.turn = Players.WHITE;
        // [[left-black, right-black], [left-white, right-white]]
        this.castlingRights = [[true, true], [true, true]];
        this.en_passant = null;
        this.playing_as = Players.NONE;
    }

    reset() {
        this.board = GameState.newBoard();
        this.turn = Players.WHITE;
        // [[left-black, right-black], [left-white, right-white]]
        this.castlingRights = [[true, true], [true, true]];
        this.en_passant = null;
        this.playing_as = Players.NONE;
    }

    copy() {
        const new_game = new GameState();
        new_game.turn = this.turn;
        new_game.playing_as = this.playing_as;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                new_game.board[y][x] = this.board[y][x];
            }
        }

        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                new_game.castlingRights[y][x] = this.castlingRights[y][x];
            }
        }
        if (this.en_passant === null) {
            new_game.en_passant = null;
        } else {
            new_game.en_passant = [this.en_passant[0], this.en_passant[1]];
        }
        return new_game
    }

    accessSquare(x, y) {
        return this.board[y - 1][x - 1];
    }

    writeSquare(x, y, val) {
        this.board[y - 1][x - 1] = val;
    }

    makeMove(start, end, promotion_target = PieceTypes.QUEEN) {
        if (!GameState.coordinatesWithinBounds(start, end)) {
            return false;
        }
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const white_backrank = 1;
        const black_backrank = 8;
        const piece_moved = this.accessSquare(start_x, start_y);
        if (piece_moved === Pieces.NONE || piece_moved === 0 || piece_moved === null) {
            return false;
        }
        const piece_type = GameState.getPieceType(piece_moved);
        if (piece_type === PieceTypes.NONE) {
            return false;
        }
        const piece_color = GameState.getPieceColor(piece_moved);
        if (piece_color === Players.NONE) {
            return false;
        }
        var result = false;
        if (piece_type === PieceTypes.KING && (Math.abs(dx) === 2) && 
        ((end_y === white_backrank && piece_color === Players.WHITE) || (end_y === black_backrank && piece_color === Players.BLACK))) {
            result = this.makeCastlingMove(start, end);
        } else if (piece_type === PieceTypes.PAWN && 
        ((end_y === white_backrank && piece_color === Players.BLACK) || (end_y === black_backrank && piece_color === Players.WHITE))) {
            result = this.makePromotingMove(start, end, promotion_target);
        } else if (piece_type === PieceTypes.PAWN && (Math.abs(dx) === 1) && (Math.abs(dy) === 1) &&
        (this.accessSquare(end_x, end_y) === Pieces.NONE)) {
            result = this.makeEnPassantMove(start, end);
        } else {
            result = this.makeGenericMove(start, end);
        }
        return result
    }

    makeCastlingMove(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const white_backrank = 1;
        const black_backrank = 8;
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_type = GameState.getPieceType(piece_moved);
        const piece_color = GameState.getPieceColor(piece_moved);
        const castling_direction = dx / Math.abs(dx);
        if (![-1, 1].includes(castling_direction)) {
            return false;
        }
        let rook_start_square;
        let rook_end_square;
        if (castling_direction === -1) {
            rook_start_square = [1, end_y];
            rook_end_square = [4, end_y];
        } else {
            rook_start_square = [8, end_y];
            rook_end_square = [6, end_y];
        }
        const moved_rook = this.accessSquare(...rook_start_square);
        if (moved_rook === Pieces.NONE) {
            return false;
        }
        this.writeSquare(start_x, start_y, Pieces.NONE);
        this.writeSquare(end_x, end_y, piece_moved);

        this.writeSquare(...rook_start_square, Pieces.NONE);
        this.writeSquare(...rook_end_square, moved_rook);
        if (piece_color === Players.WHITE) {
            this.castlingRights[1] = [false, false];
        } else {
            this.castlingRights[0] = [false, false];
        }
        this.en_passant = null;
        this.changeTurn();
        return true;

    }

    makePromotingMove(start, end, promotion_target) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const white_backrank = 1;
        const black_backrank = 8;
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_type = GameState.getPieceType(piece_moved);
        const piece_color = GameState.getPieceColor(piece_moved);
        
        const promotion_diff = (promotion_target - PieceTypes.PAWN);
        const result_piece = (piece_moved + promotion_diff);
        this.writeSquare(start_x, start_y, Pieces.NONE);
        this.writeSquare(end_x, end_y, result_piece);

        this.en_passant = null;
        this.changeTurn();
        return true;
    }

    makeEnPassantMove(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const white_backrank = 1;
        const black_backrank = 8;
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_type = GameState.getPieceType(piece_moved);
        const piece_color = GameState.getPieceColor(piece_moved);
        
        this.writeSquare(start_x, start_y, Pieces.NONE);
        this.writeSquare(end_x, end_y, piece_moved);
        this.writeSquare(end_x, start_y, Pieces.NONE);

        this.en_passant = null;
        this.changeTurn();
        return true;
    }

    makeGenericMove(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const white_backrank = 1;
        const black_backrank = 8;
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_type = GameState.getPieceType(piece_moved);
        const piece_color = GameState.getPieceColor(piece_moved);

        this.en_passant = null;
        if (piece_type === PieceTypes.KING) {
            if (piece_color === Players.WHITE) {
                this.castlingRights[1] = [false, false];
            } else {
                this.castlingRights[0] = [false, false];
            }
        } else if (piece_type === PieceTypes.PAWN && Math.abs(dy) === 2) {
            this.en_passant = [end_x, start_y + Math.floor(dy / 2)];
        } else if (piece_type === PieceTypes.ROOK) {
            if (this.accessSquare(1, white_backrank) !== Pieces.WHITE_ROOK) {
                this.castlingRights[1][0] = false;
            } else if (this.accessSquare(8, white_backrank) !== Pieces.WHITE_ROOK) {
                this.castlingRights[1][1] = false;
            } else if (this.accessSquare(1, black_backrank) !== Pieces.BLACK_ROOK) {
                this.castlingRights[0][0] = false;
            } else if (this.accessSquare(8, black_backrank) !== Pieces.BLACK_ROOK) {
                this.castlingRights[0][1] = false;
            }
        }
        this.writeSquare(start_x, start_y, Pieces.NONE);
        this.writeSquare(end_x, end_y, piece_moved);
        this.changeTurn();
        return true;
    }

    changeTurn() {
        if (this.turn === Players.BLACK) {
            this.turn = Players.WHITE;
        } else {
            this.turn = Players.BLACK;
        }
        return;
    }

    moveIsLegal(start, end, playing_as = null) {
        if (playing_as === null) {playing_as = this.playing_as;}
        if (!GameState.coordinatesWithinBounds(start, end)) {
            return false;
        }
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        if (dx === 0 && dy === 0) { // Can't move in place
            return false;
        }
        const white_backrank = 1;
        const black_backrank = 8;
        const piece_moved = this.accessSquare(start_x, start_y);
        if (piece_moved === Pieces.NONE || piece_moved === 0 || piece_moved === null) {
            return false;
        }
        const piece_type = GameState.getPieceType(piece_moved);
        if (piece_type === PieceTypes.NONE) {
            return false;
        }
        const piece_color = GameState.getPieceColor(piece_moved);
        if (piece_color === Players.NONE) {
            return false;
        }
        if (piece_color !== this.turn || (piece_color !== playing_as && playing_as !== Players.NONE)) {
            return false;
        }
        var result = false;
        if (piece_type === PieceTypes.KING && (Math.abs(dx) === 2) && 
        ((end_y === white_backrank && piece_color === Players.WHITE) || (end_y === black_backrank && piece_color === Players.BLACK))) {
            result = this.castlingIsLegal(start, end);
        } else if (piece_type === PieceTypes.PAWN && (Math.abs(dx) === 1) && (Math.abs(dy) === 1) &&
        (this.accessSquare(end_x, end_y) === Pieces.NONE)) {
            result = this.enPassantIsLegal(start, end);
        } else {
            result = this.genericMoveIsLegal(start, end);
        }
        if (!result) {
            return false;
        }
        if (this.inCheckAfterMove(start, end)) {
            return false;
        }
        return true;
    }

    castlingIsLegal(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const abs_dx = Math.abs(dx);
        const abs_dy = Math.abs(dy);
        const white_backrank = 1;
        const black_backrank = 8;
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_type = GameState.getPieceType(piece_moved);
        const piece_color = GameState.getPieceColor(piece_moved);
        const castling_direction = dx / Math.abs(dx);
        if (![-1, 1].includes(castling_direction)) {
            return false;
        }
        if (abs_dx !== 2 || abs_dy !== 0) {
            return false;
        }
        if ((piece_color === Players.WHITE && end_y !== white_backrank) || (piece_color === Players.BLACK && end_y !== black_backrank)) {
            return false;
        }
        let castling_right_index1;
        let castling_right_index2;
        let target_rook;
        if (piece_color === Players.WHITE) {
            castling_right_index1 = 1; 
            target_rook = Pieces.WHITE_ROOK;
        } else {
            castling_right_index1 = 0;
            target_rook = Pieces.BLACK_ROOK;
        }
        let rook_start_square;
        let rook_end_square;
        if (castling_direction === -1) {
            rook_start_square = [1, end_y];
            rook_end_square = [4, end_y];
            castling_right_index2 = 0;
        } else {
            rook_start_square = [8, end_y];
            rook_end_square = [6, end_y];
            castling_right_index2 = 1;
        }
        const moved_rook = this.accessSquare(...rook_start_square);
        if (moved_rook !== target_rook) {
            return false;
        }
        if (!this.castlingRights[castling_right_index1][castling_right_index2]) {
            return false;
        }
        if (this.kingIsInCheck(piece_color) || this.squareIsAttacked([start_x + castling_direction, end_y], GameState)) {
            return false;
        }
        if (this.squareIsAttacked([start_x + castling_direction, end_y], GameState.switchTeam(piece_color))) {
            return false;
        }
        const iter_is_over = (val) => {
            if (castling_direction === -1) {
                return val <= 1;
            } else {
                return val >= 8;
            }
        };
        for (let x = start_x + castling_direction; x += castling_direction; !iter_is_over(x)) {
            if (this.accessSquare(x, end_y) !== Pieces.NONE) {return false;}
        }
        return true;
    }

    enPassantIsLegal(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const abs_dx = Math.abs(dx);
        const abs_dy = Math.abs(dy);
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_type = GameState.getPieceType(piece_moved);
        const piece_color = GameState.getPieceColor(piece_moved);
        if (piece_type !== PieceTypes.PAWN) {return false;}
        let allowed_y_direction;
        if (piece_color === Players.NONE) {return false;}
        if (piece_color === Players.WHITE) {
            allowed_y_direction = 1;
        } else {
            allowed_y_direction = -1;
        }
        if (abs_dx !== 1 || abs_dy !== 1) {
            return false;
        }
        if (dy !== allowed_y_direction) {
            return false;
        }
        if (this.accessSquare(end_x, end_y) !== Pieces.NONE) {
            return false;
        }
        if (this.en_passant === null) {
            return false;
        }
        const en_passant_target = [end_x, start_y];
        if (this.en_passant[0] !== en_passant_target[0] || this.en_passant[1] !== en_passant_target[1]) {
            return false;
        }
        return true;
    }

    genericMoveIsLegal(start, end, check_obstruction = true) { // Calculates pseudo-legality
        if (check_obstruction) {
            if (this.isPathObstructed(start, end)) { // Calculates obstruction but not pseudo-legaity
                return false;
            }
        }    
        const [start_x, start_y] = start;
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_type = GameState.getPieceType(piece_moved);
        switch (piece_type) {
            // Calculates pseudo-legality without accounting for obstruction
            case PieceTypes.ROOK:
                return this.rookMoveIsLegal(start, end);
            case PieceTypes.BISHOP:
                return this.bishopMoveIsLegal(start, end);
            case PieceTypes.KNIGHT:
                return this.knightMoveIsLegal(start, end);
            case PieceTypes.QUEEN:
                return this.queenMoveIsLegal(start, end);
            case PieceTypes.KING:
                return this.kingMoveIsLegal(start, end);
            case PieceTypes.PAWN:
                return this.pawnMoveIsLegal(start, end);
        }
        return false;
    }

    isPathObstructed(start, end) { // Calculates both team-killing and obstruction
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_color = GameState.getPieceColor(piece_moved);
        
        let direction_x;
        let direction_y;
        if (dx === 0) {direction_x = 0;} else {direction_x = dx / Math.abs(dx);}
        if (dy === 0) {direction_y = 0;} else {direction_y = dy / Math.abs(dy);}
        const piece_at_destination = this.accessSquare(end_x, end_y);
        const piece_color_at_destination = GameState.getPieceColor(piece_at_destination);
        if (piece_color_at_destination === piece_color) { // No team-killing
            return true;
        }
        if (dx !== 0 && dy !== 0) { // Diagonal movement
            if (Math.abs(dx) !== Math.abs(dy)) { // Movement isn't completely diagonal (45 degrees)
                return false; // We can't calculate obstruction
            }
        }
        const movement_amplitude = Math.max(Math.abs(dx), Math.abs(dy));
        for (let i = 1; i < movement_amplitude; i++) { // For every square up to but not including the destination and the start
            let target = [start_x + i * direction_x, start_y + i * direction_y]; 
            if (this.accessSquare(...target) !== Pieces.NONE) { // If there's a piece in the way
                return true; // The path is obstructed
            }
        }
        return false; // If all of the conditions are met, the path is not obstructed
    }

    rookMoveIsLegal(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        if (dx === 0 || dy === 0) { // Moving on only one axis
            return true;
        }
        return false;
    }

    bishopMoveIsLegal(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        if (Math.abs(dx) === Math.abs(dy)) { // Moving on both axis equally
            return true;
        }
        return false;
    }

    knightMoveIsLegal(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const abs_dx = Math.abs(dx);
        const abs_dy = Math.abs(dy);
        if ((abs_dx === 2 && abs_dy === 1) || (abs_dx === 1 && abs_dy === 2)) {
            return true
        }
        return false;
    }

    queenMoveIsLegal(start, end) {
        return (this.rookMoveIsLegal(start, end) || this.bishopMoveIsLegal(start, end));
    }

    kingMoveIsLegal(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const abs_dx = Math.abs(dx);
        const abs_dy = Math.abs(dy);
        if (abs_dx > 1 || abs_dy > 1) {
            return false;
        }    
        return true;
    }

    pawnMoveIsLegal(start, end) {
        const [start_x, start_y] = start;
        const [end_x, end_y] = end;
        const dx = end_x - start_x;
        const dy = end_y - start_y;
        const abs_dx = Math.abs(dx);
        const abs_dy = Math.abs(dy);
        const piece_moved = this.accessSquare(start_x, start_y);
        const piece_color = GameState.getPieceColor(piece_moved);
        const piece_at_destination = this.accessSquare(end_x, end_y);
        let double_step_start_rank;
        let allowed_y_direction;
        if (piece_color === Players.NONE) {return false;}
        if (piece_color === Players.WHITE) {
            double_step_start_rank = 2;
            allowed_y_direction = 1;
        } else {
            double_step_start_rank = 7;
            allowed_y_direction = -1;
        }
        if (dy === 0) {return false;}
        let actual_y_direction = dy / abs_dy;
        if (actual_y_direction !== allowed_y_direction) { // If we are going in the wrong direction
            return false
        }
        if (abs_dy > 2 || abs_dx > 1 || abs_dy === 0) { // If we performed an illegal movement
            return false;
        } else if (abs_dy === 2 && (abs_dx !== 0 || start_y !== double_step_start_rank)) { // If we stepped forwards two squares but did not meet
            return false;                                                                  // the requirements
        }
        const moved_diagonally = abs_dx === 1 && abs_dy === 1;
        const did_capture = piece_at_destination !== Pieces.NONE;
        if (moved_diagonally !== did_capture) { // If we moved diagonally but did not capture or vice-versa
            return false;
        }
        return true;
    }

    squareIsAttacked(square, attacker) {
        if (!([Players.WHITE, Players.BLACK].includes(attacker))) {
            return false;
        }
        const [target_x, target_y] = square;
        for (let start_y = 1; start_y <= 8; start_y++) {
            for (let start_x = 1; start_x <= 8; start_x++) {
                const attacking_piece = this.accessSquare(start_x, start_y);
                const attacking_piece_color = GameState.getPieceColor(attacking_piece);
                if (attacking_piece_color !== attacker) {continue;}
                if (this.genericMoveIsLegal([start_x, start_y], square)) {
                    return true;
                }
            }
        }
        return false;
    }

    kingIsInCheck(defender) {
        let attacking_team;
        let defending_king;
        if (!([Players.WHITE, Players.BLACK].includes(defender))) {
            return false;
        }
        if (defender === Players.WHITE) {
            attacking_team = Players.BLACK;
            defending_king = Pieces.WHITE_KING;
        } else {
            attacking_team = Players.WHITE;
            defending_king = Pieces.BLACK_KING;
        }
        let king_count = 0;
        let king_position;
        for (let y = 1; y <= 8; y++) {
            for (let x = 1; x <= 8; x++) {
                const piece_at_square = this.accessSquare(x, y);
                if (piece_at_square === defending_king) {
                    king_count++;
                    king_position = [x, y];
                }
            }
        }
        if (king_count !== 1) {
            return null;
        }
        return this.squareIsAttacked(king_position, attacking_team);
    }

    inCheckAfterMove(start, end) {
        const game_copy = this.copy();
        game_copy.makeMove(start, end);
        return game_copy.kingIsInCheck(this.turn);
    }

    pieceHasLegalMove(start) { // assumes piece color == this.turn
        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                if (!this.genericMoveIsLegal(start, [x, y], false) && !this.enPassantIsLegal(start, [x, y])) {continue;}
                if (this.moveIsLegal(start, [x, y], this.turn)) {return true;}
            }
        }
        return false;
    }

    currentPlayerHasLegalMove() {
        for (let x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                const piece_color = GameState.getPieceColor(this.accessSquare(x, y));
                if (piece_color === this.turn) {
                    if (this.pieceHasLegalMove([x, y])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isGameOver() {
        if (!this.currentPlayerHasLegalMove()) {
            if (this.kingIsInCheck(this.turn)) {
                return GameResults.CHECKMATE;
            } else {
                return GameResults.STALEMATE;
            }
        }
        let white_king_count = 0;
        let white_sufficient_material = false;
        let white_minor_piece_count = 0;

        let black_king_count = 0;
        let black_sufficient_material = false;
        let black_minor_piece_count = 0;

        for (let y = 1; y <= 8; y++) {
            for (let x = 1; x <= 8; x++) {
                const piece_at_square = this.accessSquare(x, y);
                if (piece_at_square === Pieces.NONE) {continue;}
                const piece_color_at_square = GameState.getPieceColor(piece_at_square);
                const piece_type_at_sqaure = GameState.getPieceType(piece_at_square);
                if (piece_color_at_square === Players.NONE || piece_type_at_sqaure === PieceTypes.NONE) {continue;}
                if (piece_color_at_square === Players.WHITE) {
                    if ([PieceTypes.ROOK, PieceTypes.QUEEN, PieceTypes.PAWN].includes(piece_type_at_sqaure)) {
                        white_sufficient_material = true;
                    } else if (piece_type_at_sqaure === PieceTypes.BISHOP) {
                        white_minor_piece_count += 2;
                    } else if (piece_type_at_sqaure === PieceTypes.KNIGHT) {
                        white_minor_piece_count += 1;
                    } else if (piece_type_at_sqaure === PieceTypes.KING) {
                        white_king_count += 1;
                    }
                } else {
                    if ([PieceTypes.ROOK, PieceTypes.QUEEN, PieceTypes.PAWN].includes(piece_type_at_sqaure)) {
                        black_sufficient_material = true;
                    } else if (piece_type_at_sqaure === PieceTypes.BISHOP) {
                        black_minor_piece_count += 2;
                    } else if (piece_type_at_sqaure === PieceTypes.KNIGHT) {
                        black_minor_piece_count += 1;
                    } else if (piece_type_at_sqaure === PieceTypes.KING) {
                        black_king_count += 1;
                    }
                }
            }
        }
        if (white_minor_piece_count >= 3) {white_sufficient_material = true;}
        if (black_minor_piece_count >= 3) {black_sufficient_material = true;}
        if (white_king_count !== 1 || black_king_count !== 1) {
            return GameResults.INVALID_KING_COUNT;
        }
        if (!(white_sufficient_material || black_sufficient_material)) {
            return GameResults.INSUFFICIENT_MATERIAL;
        }
        return false;
    }
}

export {PieceTypes, Pieces, GameState, Players, ImageDict, GameResults};
