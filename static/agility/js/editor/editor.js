


var editor_cb_create = {
    'jump' : editor_jump_create,
    'mur' : editor_mur_create,
    'A' : editor_A_create,
    'tunnel' : editor_tunnel_create,
    'slalom' : editor_slalom_create,
    'slalom_x6' : editor_slalom_x6_create,
    'passerelle' : editor_passerelle_create,
    'balance' : editor_balance_create,
    'pneu' : editor_pneu_create,
    'oxer' : editor_oxer_create,
    'longueur' : editor_longueur_create,
    'table' : editor_table_create,
    'chaussette' : editor_chaussette_create,
    'track_b' : editor_trackb_create,
    'track_w' : editor_trackw_create,
    'track_r' : editor_trackr_create,
    'track_y' : editor_tracky_create,
    'number_b' : editor_numberb_create,
    'number_w' : editor_numberw_create,
    'number_r' : editor_numberr_create,
    'number_y' : editor_numbery_create
}

var EDITOR_O_JUMP = 'jump';
var EDITOR_O_MUR = 'mur';
var EDITOR_O_A = 'A';
var EDITOR_O_TUNNEL = 'tunnel';
var EDITOR_O_SLALOM = 'slalom';
var EDITOR_O_SLALOM_X6 = 'slalom_x6';
var EDITOR_O_PASSERELLE = 'passerelle';
var EDITOR_O_BALANCE = 'balance';
var EDITOR_O_PNEU = 'pneu';
var EDITOR_O_OXER = 'oxer';
var EDITOR_O_LONGUEUR = 'longueur';
var EDITOR_O_TABLE = 'table';
var EDITOR_O_CHAUSSETTE = 'chaussette';

var EDITOR_O_TRACK = 'track';
var EDITOR_O_TRACKB = 'track_b';
var EDITOR_O_TRACKW = 'track_w';
var EDITOR_O_TRACKR = 'track_r';
var EDITOR_O_TRACKY = 'track_y';
var EDITOR_O_NUMBER = 'number';
var EDITOR_O_NUMBERB = 'number_b';
var EDITOR_O_NUMBERW = 'number_w';
var EDITOR_O_NUMBERR = 'number_r';
var EDITOR_O_NUMBERY = 'number_y';

var EDITOR_O_BORDER_SIZE = 10;

var EDITOR_O_JUMP_W = 60;
var EDITOR_O_JUMP_H = 8;

var EDITOR_O_MUR_W = 58;
var EDITOR_O_MUR_H = 16;

var EDITOR_O_PNEU_W = 45;
var EDITOR_O_PNEU_H = 25;

var EDITOR_O_OXER_W = 60;
var EDITOR_O_OXER_H = 20;

var EDITOR_O_LONGUEUR_W = 56;
var EDITOR_O_LONGUEUR_H = 40;

var EDITOR_O_CHAUSSETTE_W = 80;
var EDITOR_O_CHAUSSETTE_H = 16;

var EDITOR_O_TABLE_W = 24;
var EDITOR_O_TABLE_H = 24;

var EDITOR_O_A_W = 86;
var EDITOR_O_A_H = 24;

var EDITOR_O_NUMBER_W = 15;
var EDITOR_O_NUMBER_H = 15;

var EDITOR_O_SLALOM_W = 142;
var EDITOR_O_SLALOM_H = 7;
var EDITOR_O_SLALOM_X6_W = 70;
var EDITOR_O_SLALOM_X6_H = 7;

var EDITOR_O_PASSERELLE_W = 240;
var EDITOR_O_PASSERELLE_H = 9;

var EDITOR_O_BALANCE_W = 91;
var EDITOR_O_BALANCE_H = 9;

var EDITOR_O_TUNNEL_R = 16;
var EDITOR_O_TUNNEL_H = 100;

var EDITOR_O_TRACK_R = 2;
var EDITOR_O_TRACK_H = 0;
var EDITOR_O_TRACK_W = 75;




//taille: réelle / 10 * 2 = pixels
function editor_convert_centimeters_to_pixels(centimeters) {
    return centimeters / 10 * 2;
}
function editor_convert_pixels_to_centimeters(pixels) {
    return ( pixels * 10 ) / 2;
}

function editor_object_detach(obj_line, obj_o) {
    for(point_id in obj_line.attached) {
        if(obj_line.attached[point_id] == obj_o) {
            obj_line.attached[point_id] = null;
            if (point_id == 0) {
                point = obj_line.objects.controls[1];
            } else {
                point = obj_line.objects.controls[4];
            }
            point.attr({ 'fill': '#fff' });
        }
    }
}

function editor_object_attach(obj_line, obj_o, point_id) {
    if (point_id == 0) {
        point = obj_line.objects.controls[1];
    } else {
        point = obj_line.objects.controls[4];
    }

    if(obj_line.attached[point_id]) {
        editor_object_detach(obj_line, obj_line.attached[point_id]);
    }

    obj_line.attached[point_id] = obj_o;
    point.attr({ 'fill': '#319ff4' });
}

function editor_update_attached(obj, point_id) {
    if (point_id == 0) {
        point = obj.objects.controls[1];
    } else {
        point = obj.objects.controls[4];
    }
    bbox = point.getBBox();
    posx = bbox.cx;
    posy = bbox.cy;
    
    //gestion de l'attache
    if(obj.attached[point_id]) {
        //1. on regarde si on se trouve toujours sur le point actuellement attaché
        bbox = obj.attached[point_id].getBBox();
        cx = bbox.cx;
        cy = bbox.cy;
        if(! (posx > cx - 5 && posx < cx + 5 && posy > cy - 5 && posy < cy + 5 ) ) {
            //2. si non, on le détache
            editor_object_detach(obj, obj.attached[point_id]);
        }
    }
    //3. et on regarde si on est sur un autre point
    if(!obj.attached[point_id]) {
        for(o in obj.editor.objects) {
            o = obj.editor.objects[o];
            if(!o.is_not_in_field && o.objects.attached) {
                for (a in o.objects.attached.items) {
                    a = o.objects.attached.items[a];
                    bbox = a.getBBox();
                    cx = bbox.cx;
                    cy = bbox.cy;
                    if(posx > cx - 5 && posx < cx + 5 && posy > cy - 5 && posy < cy + 5) {
                        editor_object_attach(obj, a, point_id);
                    }
                }
            }
        }
    }
}

function editor_curve(obj, x, y, ax, ay, bx, by, zx, zy, color, stroke_width, is_arrow_end) {
    r = obj.editor.R;
    var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]];
    var path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy]];
    var curve = r.path(path).attr({stroke: color, "stroke-width": stroke_width, "stroke-linecap": "butt"});

    obj.objects.curve_text = obj.editor.R.text(0, 0, '').attr({"text-anchor" : "start", "fill": '#fff', "font-weight": "bold", "font-size": 12, "opacity": 0});
    obj.objects.curve_text.node.setAttribute("pointer-events", "none");
    var controls = r.set(
            r.path(path2).attr({stroke: "#ef4848", "stroke-dasharray": ". ", "stroke-width": 2}),
            r.circle(x, y, 5).attr({fill: "#fff", stroke: "none"}),
            r.circle(ax, ay, 5).attr({fill: "#ef4848", stroke: "none"}),
            r.circle(bx, by, 5).attr({fill: "#ef4848", stroke: "none"}),
            r.circle(zx, zy, 5).attr({fill: "#fff", stroke: "none"})
        );
    controls[1].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[0][1] = X;
        path[0][2] = Y;
        path2[0][1] = X;
        path2[0][2] = Y;
        controls[2].update(x, y);
        if(obj.objects.attached) {
            obj.objects.attached[0].attr({'cx': X, 'cy': Y});
        }
        if(obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY) {
            editor_update_attached(obj, 0);
        }
        editor_curve_update_action_select(obj, null, null);
        editor_curve_length(obj);
    };
    controls[2].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][1] = X;
        path[1][2] = Y;
        path2[1][1] = X;
        path2[1][2] = Y;
        //pour IE il faut enlever la flêche avant de modifier la ligne sinon bug
        save_arrow = curve.attr("arrow-end");
        curve.attr({ "arrow-end": "" });
        curve.attr({path: path});
        curve.attr({ "arrow-end": save_arrow });
        //
        controls[0].attr({path: path2});
        editor_curve_update_action_select(obj, null, null);
        editor_curve_length(obj);
    };
    controls[3].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][3] = X;
        path[1][4] = Y;
        path2[2][1] = X;
        path2[2][2] = Y;
        //pour IE il faut enlever la flêche avant de modifier la ligne sinon bug
        save_arrow = curve.attr("arrow-end");
        curve.attr({ "arrow-end": "" });
        curve.attr({path: path});
        curve.attr({ "arrow-end": save_arrow });
        //
        controls[0].attr({path: path2});
        editor_curve_update_action_select(obj, null, null);
        editor_curve_length(obj);
    };
    controls[4].update = function (x, y) {
        var X = this.attr("cx") + x,
            Y = this.attr("cy") + y;
        this.attr({cx: X, cy: Y});
        path[1][5] = X;
        path[1][6] = Y;
        path2[3][1] = X;
        path2[3][2] = Y;
        controls[3].update(x, y);
        if(obj.objects.attached) {
            obj.objects.attached[1].attr({'cx': X, 'cy': Y});
        }
        if(obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY) {
            editor_update_attached(obj, 1);
        }
        editor_curve_update_action_select(obj, null, null);
        editor_curve_length(obj);
    };

    function editor_curve_start(dx, dy) {
        if( ( obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY ) && ( this==controls[1] || this==controls[4] ) ) {  
            for(o in obj.editor.objects) { 
                o = obj.editor.objects[o];
                if (o.objects.attached && !o.is_not_in_field) {
                    o.objects.attached.animate({opacity: 1});
                }
            }
        }
    }
    function editor_curve_move(dx, dy) {
        this.update(dx - (this.dx || 0), dy - (this.dy || 0));
        this.dx = dx;
        this.dy = dy;
    }
    function editor_curve_up() {
        this.dx = this.dy = 0;
        if(obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY) {  
            for(o in obj.editor.objects) { 
                o = obj.editor.objects[o];
                if (o.objects.attached) {
                    o.objects.attached.animate({opacity: 0});
                }
            }

            if(this == obj.objects.controls[1] && obj.attached[0]) {
                point_bbox = this.getBBox();
                obj_o_bbox = obj.attached[0].getBBox();
                this.update((obj_o_bbox.x - point_bbox.x), (obj_o_bbox.y  - point_bbox.y));
            }

            if(this == obj.objects.controls[4] && obj.attached[1]) {
                point_bbox = this.getBBox();
                obj_o_bbox = obj.attached[1].getBBox();
                this.update((obj_o_bbox.x - point_bbox.x), (obj_o_bbox.y  - point_bbox.y));
            }
        }
    }
    controls[1].drag(editor_curve_move, editor_curve_start, editor_curve_up);
    controls[2].drag(editor_curve_move, editor_curve_start, editor_curve_up);
    controls[3].drag(editor_curve_move, editor_curve_start, editor_curve_up);
    controls[4].drag(editor_curve_move, editor_curve_start, editor_curve_up);

    if(is_arrow_end) {
        curve.attr({ 
            "stroke-width": 3, 
            "arrow-end": "block-wide-long"});
    }

    controls.animate({opacity: 0}, 0);

    editor_curve_update_action_select(obj, curve, controls);
    return [curve, controls];
}

function editor_curve_length(obj) {
    curve = obj.objects.object;
    l = curve.getTotalLength();   
    l = editor_convert_pixels_to_centimeters(l);
    l = l / 100;
    color = '#fff';
    l = Math.round(l*10)/10;
    if(obj.type == EDITOR_O_TUNNEL && ( l < 3 || l > 6 ) ) {
        color = "#FF0000";
    } else if(obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY) {
        if(l<4 || l>7) {
            color = "#FF0000";
        } else if(l>=4 && l<5) {
            color = "#e7642b";
        }
    }
    _editor_display_curve_text(obj, Math.round(l*10)/10 + ' m', color);
}

function _editor_display_curve_text(obj, text, color) {
    curve = obj.objects.object;

    if(!obj.is_not_in_field) {
        obj.objects.curve_text.attr({"text": text});
        bbox = obj.objects.curve_text.getBBox();
        p = curve.getPointAtLength(curve.getTotalLength()/2);
        obj.objects.curve_text.attr({ x: p.x - bbox.width / 2, y: p.y + bbox.height / 2, "opacity": 1, "fill": color});
        obj.objects.curve_text.transform(curve.matrix.toTransformString());
    }
}

function editor_curve_update_action_select(obj, curve, controls) {
    if (curve == null) {
        curve = obj.objects.object;
    }
    if (controls == null) {
        controls = obj.objects.controls;
    }

    var x0 = controls[1].attr('cx');
    var y0 = controls[1].attr('cy');
    var x1 = controls[2].attr('cx');
    var y1 = controls[2].attr('cy');
    var x2 = controls[3].attr('cx');
    var y2 = controls[3].attr('cy');
    var x3 = controls[4].attr('cx');
    var y3 = controls[4].attr('cy');

    t = 0;
    x_min = 99999999;
    x_max = 0;
    y_min = 99999999;
    y_max = 0;

    x_prev = x0;
    y_prev = y0;
    while(t<=1) {
        var x=x0*Math.pow(1-t,3)+3*x1*t*Math.pow(1-t, 2)+3*x2*Math.pow(t, 2)*(1-t)+x3*Math.pow(t, 3);
        var y=y0*Math.pow(1-t,3)+3*y1*t*Math.pow(1-t, 2)+3*y2*Math.pow(t, 2)*(1-t)+y3*Math.pow(t, 3);

        if (x > x_max) {
            x_max = x;
        }
        if (x < x_min) {
            x_min = x;
        }
        if (y > y_max) {
            y_max = y;
        }
        if (y < y_min) {
            y_min = y;
        }

        x_prev = x;
        y_prev = y;
        t = t + 0.05;
    }

    object_select = obj.objects.object_select;
    object_select.attr( {
        x: x_min - EDITOR_O_BORDER_SIZE - EDITOR_O_TUNNEL_R / 2, 
        y: y_min - EDITOR_O_BORDER_SIZE - EDITOR_O_TUNNEL_R / 2, 
        width: x_max - x_min + EDITOR_O_BORDER_SIZE * 2 + EDITOR_O_TUNNEL_R , 
        height: y_max - y_min + EDITOR_O_BORDER_SIZE * 2 + EDITOR_O_TUNNEL_R 
    });
}

var editor_toolbar_left_width = 150;
var editor_toolbar_right_width = 50;

//Minimum 20/40
//Maximum 40/40
//width/height: centimeters
function editor_create(holder_id, width, height, static_path) {
    document.getElementById(holder_id).innerHTML = "";
    var R = Raphael(
        holder_id, 
        editor_convert_centimeters_to_pixels(width) + editor_toolbar_left_width + editor_toolbar_right_width, 
        editor_convert_centimeters_to_pixels(height)
    );

    var editor = {
        'R': R,
        'toolbar_left_width': editor_toolbar_left_width,
        'toolbar_right_width': editor_toolbar_right_width,
        'holder_id': holder_id,
        'static_path': static_path,
        'grille': { 'width': null, 'paths': R.set() },
        'objects': [],
        'object_selected': null,
        'trash': { 'object': null, 'x': 0, 'y': 0, 'w': 0, 'h': 0},
        'number_trash': {},
        'width': width,
        'height': height,
        'width_px': editor_convert_centimeters_to_pixels(width) + editor_toolbar_left_width + editor_toolbar_right_width,
        'height_px': editor_convert_centimeters_to_pixels(height),
        'bg_field': null,
        'bg_toolbar_left': null,
        'bg_toolbar_right': null,
        'path_separate_obstacles': null
    };

    

    //init toolbar
    _editor_draw_field(editor);
    editor_jump_create(editor);
    editor_A_create(editor);
    editor_tunnel_create(editor);
    editor_slalom_create(editor);
    editor_slalom_x6_create(editor);
    editor_passerelle_create(editor);
    editor_balance_create(editor);
    editor_mur_create(editor);
    editor_pneu_create(editor);
    editor_oxer_create(editor);
    editor_longueur_create(editor);
    editor_table_create(editor);
    editor_chaussette_create(editor);
    editor_trackb_create(editor);
    editor_trackw_create(editor);
    editor_trackr_create(editor);
    editor_tracky_create(editor);
    editor_numberb_create(editor);
    editor_numberw_create(editor);
    editor_numberr_create(editor);
    editor_numbery_create(editor);

    return editor;
}

function _editor_draw_field(editor) {
    $('#' + editor.holder_id).css('width', editor.width_px);
    $('#' + editor.holder_id).css('height', editor.height_px);

    if(editor.bg_field) {
        editor.bg_field.remove();
    }
    var rect = editor.R.rect(editor.toolbar_left_width, 0, 
        editor.width_px - editor.toolbar_left_width - editor.toolbar_right_width, 
        editor.height_px);
    editor.bg_field = rect;
    rect.attr("fill", "#61d867");
    rect.mousedown(function(){
        _editor_unselect_object(editor.object_selected);
    });   

    if(editor.bg_toolbar_left) {
        editor.bg_toolbar_left.remove();
    }
    var rect = editor.R.rect(0, 0, editor.toolbar_left_width, editor.height_px);
    editor.bg_toolbar_left = rect;
    rect.attr("fill", "#d1d1d1");
    rect.mousedown(function(){
        _editor_unselect_object(editor, editor.object_selected);
    });   

    if(editor.bg_toolbar_right) {
        editor.bg_toolbar_right.remove();
    }
    var rect = editor.R.rect(editor.width_px - editor.toolbar_right_width, 
        0, 
        editor.width_px, 
        editor.height_px);
    editor.bg_toolbar_right = rect;
    rect.attr("fill", "#d1d1d1");
    rect.mousedown(function(){
        _editor_unselect_object(editor, editor.object_selected);
    });

    if(editor.bg_border_right) {
        editor.bg_border_right.remove();
    }
    path = editor.R.path( [
        "M", editor.width_px, 
        0, 
        "L", editor.width_px, 
        editor.height_px ] );
    editor.bg_border_right = path;


    if(editor.path_separate_obstacles) {
        editor.path_separate_obstacles.remove();
    }
    path = editor.R.path( ["M", 5, 400, "L", editor.toolbar_left_width - 5, 400 ] );
    path.attr({opacity: 0.5});
    editor.path_separate_obstacles = path;

    //trash
    trash_size_h = 100;
    trash_size_w = 150;
    editor.trash.x = 0;
    editor.trash.y = editor.height_px - trash_size_h;
    editor.trash.w = trash_size_w;
    editor.trash.h = trash_size_h;
    if(editor.trash.object) {
        editor.trash.object.remove();
    }
    editor.trash.object = editor.R.image(editor.static_path + "/trash.png", 
        editor.trash.x, 
        editor.trash.y, 
        editor.trash.w, 
        editor.trash.h
    );
    editor.trash.object.animate({opacity: 0}, 0);
    //
    editor_grille_create(editor, 500, 100);

    editor_reorganise_objects(editor);
}

function editor_reorganise_objects(editor) {
    objs_to_delete = []
    for (obj in editor.objects) {
        obj = editor.objects[obj];

        if(!obj.is_not_in_field) {
            //si l'objet n'est pas sur le terrain on le supprime
            bbox = obj.objects.object_select.getBBox();
            if(bbox.x > editor.width_px
                || bbox.y > editor.height_px
            ) {
                objs_to_delete.push(obj);
            } else {
                editor_object_move_to_top(obj);    
            }
        }
        else {
            editor_object_move_to_top(obj);
        }
    }

    for(obj in objs_to_delete) {
        obj = obj = objs_to_delete[obj]
        editor_object_delete(obj);
    }

    for(obj in editor.number_trash) {
        obj = editor.number_trash[obj];
        obj.toFront();
    }
}

//width: centimeters
function editor_grille_create(editor, width, width_small) {
    var editor_w = editor.width_px;
    var editor_h = editor.height_px;

    editor.grille.width = width;
    editor.grille.width_small = width_small;
    editor.grille.rects = [];

    var width_px = editor_convert_centimeters_to_pixels(width);
    var width_small_px = editor_convert_centimeters_to_pixels(width_small);

    editor.grille.paths.remove();

    for(i=editor.toolbar_left_width; i<=editor_w - editor.toolbar_right_width; i = i + width_px) {
        path = editor.R.path( ["M", i, 0, "L", i, editor_h ] );
        path.attr({opacity: 0.5});
        editor.grille.paths.push(path);
    }

    for(i=0; i<=editor_h; i = i + width_px) {
        path = editor.R.path( ["M", editor.toolbar_left_width, i, "L", editor_w - editor.toolbar_right_width, i ] );
        path.attr({opacity: 0.5});
        editor.grille.paths.push(path);
    }

    for(i=editor.toolbar_left_width; i<=editor_w - editor.toolbar_right_width; i = i + width_small_px) {
        path = editor.R.path( ["M", i, 0, "L", i, editor_h ] );
        path.attr({opacity: 0.2});
        editor.grille.paths.push(path);
    }

    for(i=0; i<=editor_h; i = i + width_small_px) {
        path = editor.R.path( ["M", editor.toolbar_left_width, i, "L", editor_w - editor.toolbar_right_width, i ] );
        path.attr({opacity: 0.2});
        editor.grille.paths.push(path);
    }

    path = editor.R.path( ["M", editor_w - editor.toolbar_right_width + 10, 0, "L", editor_w - editor.toolbar_right_width + 10, width_px ] );
    path.attr({"stroke": "#000", 
        "stroke-width": 1, 
        "arrow-end": "block-wide-long", 
        "arrow-start": "block-wide-long"});
    editor.grille.paths.push(path);

    text = editor.R.text(editor_w - editor.toolbar_right_width + 20, width_px/2, (width/100) + ' m').attr({"text-anchor" : "start", "fill": '#000', "font-weight": "bold", "font-size": 12});
    text.node.setAttribute("pointer-events", "none");
    editor.grille.paths.push(text);

    editor.grille.paths.mousedown(function(){
        _editor_unselect_object(editor, editor.object_selected);
    });   
}

function editor_resize(editor, width, height) {
    editor.width = width;
    editor.height = height;
    editor.width_px = editor_convert_centimeters_to_pixels(width) + editor_toolbar_left_width + editor_toolbar_right_width;
    editor.height_px = editor_convert_centimeters_to_pixels(height);
    
    editor.R.setSize(editor.width_px, editor.height_px);

    _editor_draw_field(editor);
}

function editor_course_bbox_get(editor) {
    ret = { 'x': 9999, 'y': 9999, 'width': 0, 'height': 0 };
    x2 = 0;
    y2 = 0;
    for (obj in editor.objects) {
        obj = editor.objects[obj];

        if(obj.is_not_in_field) {
            continue;
        }
        
        bbox = obj.objects.object_select.getBBox();
        if ( bbox.x < ret.x ) {
            ret.x = bbox.x;
        }
        if ( bbox.y < ret.y ) {
            ret.y = bbox.y;
        }
        if ( bbox.x + bbox.width > x2 ) {
            x2 = bbox.x + bbox.width;
        }
        if ( bbox.y + bbox.height > y2 ) {
            y2 = bbox.y + bbox.height;
        }
    }
    ret.width = x2 - ret.x;
    ret.height = y2 - ret.y;
    return ret;
}

function editor_json_get(editor) {
    json = {
        'width': editor.width,
        'height': editor.height,
        'objects': []
    };

    for (obj in editor.objects) {
        obj = editor.objects[obj];

        if(obj.is_not_in_field) {
            continue;
        }

        if(obj.type != EDITOR_O_TRACKB 
            && obj.type != EDITOR_O_TRACKY
            && obj.type != EDITOR_O_TRACKW
            && obj.type != EDITOR_O_TRACKR
            && obj.type != EDITOR_O_TUNNEL) {
            obj.objects.object.transform("...R" + (-obj.current_rotation) );
            bbox = obj.objects.object.getBBox();
            json_o = {
                'type': obj.type,
                'x': Math.round(bbox.x),
                'y': Math.round(bbox.y),
                'width': bbox.width,
                'height': bbox.height,
                'r': obj.current_rotation,
                'number': obj.number.number
            }
            obj.objects.object.transform("...R" + obj.current_rotation );
        } else {
            json_o = {
                'type': obj.type,
                'controls': []
            };
            for(o in obj.objects.controls.items) {
                if(o==0) {
                    continue
                }
                o = obj.objects.controls.items[o];
                bbox = o.getBBox();
                json_o.controls.push( {
                    'cx': bbox.cx,
                    'cy': bbox.cy
                });
            }
        }

        json.objects.push(json_o);
    }

    return json;
}

function editor_json_load(holder_id, json, static_path) {
    editor = editor_create(holder_id, json.width, json.height, static_path);

    number_max = { };
    number_max[EDITOR_O_NUMBERB] = -1;
    number_max[EDITOR_O_NUMBERW] = -1;
    number_max[EDITOR_O_NUMBERR] = -1;
    number_max[EDITOR_O_NUMBERY] = -1;

    for(json_o in json.objects) {
        json_o = json.objects[json_o];
        
        if(json_o.type == EDITOR_O_NUMBER) {
            json_o.type = EDITOR_O_NUMBERB;
        }
        if(json_o.type == EDITOR_O_TRACK) {
            json_o.type = EDITOR_O_TRACKB;
        }

        if(json_o.type != EDITOR_O_TRACKB 
            && json_o.type != EDITOR_O_TRACKY
            && json_o.type != EDITOR_O_TRACKW
            && json_o.type != EDITOR_O_TRACKR
            && json_o.type != EDITOR_O_TUNNEL) {
            obj = editor_cb_create[json_o.type](editor);
            obj.is_not_in_field = false;
            editor_object_rotate(obj, -obj.current_rotation);
            
            if(json_o.type == EDITOR_O_NUMBERB
                || json_o.type == EDITOR_O_NUMBERW
                || json_o.type == EDITOR_O_NUMBERR
                || json_o.type == EDITOR_O_NUMBERY) {
                _editor_number_number_set(obj, json_o.number);

                if(json_o.number > number_max[json_o.type]) {
                    number_max[json_o.type] = json_o.number;
                }
            }
            bbox = obj.objects.object.getBBox();
            editor_object_move(obj, json_o.x - bbox.x, json_o.y - bbox.y);
            editor_object_rotate(obj, json_o.r);      
        } else {
            obj = editor_cb_create[json_o.type](editor);
            obj.is_not_in_field = false;

            indexs = [0, 1, 3, 2]
            for(var i_index= 0; i_index < indexs.length; i_index++) {
                i = indexs[i_index];
                o_json = json_o.controls[i];
                o = obj.objects.controls.items[i+1];
                bbox = o.getBBox();
                o.update(o_json.cx - bbox.cx, o_json.cy - bbox.cy);
            }
        }
    }

    for(key in number_max) {
        max = number_max[key];
        if(max > -1) {
            for (o in editor.objects) {
                o = editor.objects[o];
                if(o.is_not_in_field && o.type == key) {
                    _editor_number_number_set(o, max + 1);
                }
            }
        }
    }

    return editor;
}

function _editor_select_object(obj) {
    if(obj.editor.object_selected != obj) {
        _editor_unselect_object(obj.editor.object_selected);
    
        obj.editor.object_selected = obj;
        obj.objects.object_select.attr({"opacity": 1});

        if (obj.objects.object_rotate) {
            obj.objects.object_rotate.animate({opacity: 1}, 200);
            obj.objects.object_rotate.node.setAttribute("pointer-events", "all");
        }
        if(obj.type == EDITOR_O_TUNNEL
            || obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY) {
            obj.objects.controls.animate({opacity: 1}, 200);
        }

        editor_object_move_to_top(obj);
    }
}

function _editor_unselect_object(obj) {
    if(obj != null && obj.editor) {
        obj.editor.object_selected = null;
        obj.objects.object_select.attr({"opacity": 0});

        if (obj.objects.object_rotate && !obj.is_rotate) {
            obj.objects.object_rotate.animate({opacity: 0}, 200);
            obj.objects.object_rotate.node.setAttribute("pointer-events", "none");
        }
        if(obj.type == EDITOR_O_TUNNEL
            || obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY) {
            obj.objects.controls.animate({opacity: 0}, 200);
        }
    }
}

function editor_unselect_all(editor) {
    if(editor.object_selected) {
        _editor_unselect_object(editor.object_selected);
    }
}

function _editor_action_move_add(obj) {
    var start = function () {
        obj.objects_ox = 0;
        obj.objects_oy = 0;

        if( obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY ) {  
            for(o in obj.editor.objects) { 
                o = obj.editor.objects[o];
                if (o.objects.attached && !o.is_not_in_field) {
                    o.objects.attached.animate({opacity: 1});
                }
            }
        }

        if(obj.type != EDITOR_O_NUMBERB
            && obj.type != EDITOR_O_NUMBERW
            && obj.type != EDITOR_O_NUMBERR
            && obj.type != EDITOR_O_NUMBERY) {
            obj.editor.trash.object.animate({opacity: 1}, 200);
        }
    },
    move = function (dx, dy) {
        editor_object_move(obj, dx - obj.objects_ox, dy - obj.objects_oy);
        obj.objects_ox = dx;
        obj.objects_oy = dy;

        if(obj.is_not_in_field) {
            obj.cb.create_new(obj.editor);
            editor_object_move_to_top(obj);
            obj.is_not_in_field = false;

            if(obj.type == EDITOR_O_TUNNEL
                || obj.type == EDITOR_O_TRACKB
                || obj.type == EDITOR_O_TRACKR
                || obj.type == EDITOR_O_TRACKW
                || obj.type == EDITOR_O_TRACKY) {
                editor_curve_length(obj);
            }
        } else {
            if(obj.type == EDITOR_O_TRACKB
                || obj.type == EDITOR_O_TRACKR
                || obj.type == EDITOR_O_TRACKW
                || obj.type == EDITOR_O_TRACKY) {
                editor_update_attached(obj, 0);
                editor_update_attached(obj, 1);
            }
        }
    },
    up = function (event) {

        if(obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY ) {  
            for(o in obj.editor.objects) { 
                o = obj.editor.objects[o];
                if (o.objects.attached) {
                    o.objects.attached.animate({opacity: 0});
                }
            }
            if(obj.attached[0]) {
                point_bbox = obj.objects.controls[1].getBBox();
                obj_o_bbox = obj.attached[0].getBBox();
                obj.objects.controls[1].update((obj_o_bbox.x - point_bbox.x), (obj_o_bbox.y  - point_bbox.y));
            }

            if(obj.attached[1]) {
                point_bbox = obj.objects.controls[4].getBBox();
                obj_o_bbox = obj.attached[1].getBBox();
                obj.objects.controls[3].update((obj_o_bbox.x - point_bbox.x), (obj_o_bbox.y  - point_bbox.y));
            }
        }

        obj.editor.trash.object.animate({opacity: 0}, 200);

        if(obj.type != EDITOR_O_NUMBERB
            && obj.type != EDITOR_O_NUMBERW
            && obj.type != EDITOR_O_NUMBERR
            && obj.type != EDITOR_O_NUMBERY) {
            //si l'objet est dans la poubelle on le supprime
            posx = event.pageX - $('#' + obj.editor.holder_id).offset().left;
            posy = event.pageY - $('#' + obj.editor.holder_id).offset().top;
            if (posx > obj.editor.trash.x && posx < obj.editor.trash.x + obj.editor.trash.w
                && posy > obj.editor.trash.y && posy < obj.editor.trash.y + obj.editor.trash.h) {
                editor_object_delete(obj);
            }
        }

    };

    set = obj.editor.R.set(
        obj.objects.object_select, 
        obj.objects.object
    );
    set.drag(move, start, up);
}

function _editor_action_select_add(obj) {
    set = obj.editor.R.set(
        obj.objects.object_select, 
        obj.objects.object,
        obj.objects.controls
    );
    set.mousedown(function(){
        _editor_select_object(obj);
    }); 
    set.mouseover(function () {
        obj.objects.object_select.attr({"opacity": 1});
    });
    set.mouseout(function () {
        if (obj.editor.object_selected != obj) {
            obj.objects.object_select.attr({"opacity": 0});
        }
    });
}

function _editor_action_rotate_add(obj) {
    var rotate_width = 20;
    var object_rotate = obj.editor.R.image(
        obj.editor.static_path + "/rotate.png", 
        obj.objects.object_select.attr("x") + obj.objects.object_select.attr("width")/2 - rotate_width / 2, 
        obj.objects.object.attr("y") - rotate_width - 20, 
        rotate_width, 
        rotate_width
    );

    obj.objects.object_rotate = object_rotate

    object_rotate.attr({opacity: 0});

    var start_rotate = function () {
        obj.is_rotate = true;
    },
    move_rotate = function (dx, dy) {
        bbox = obj.objects.object.getBBox();
        x = bbox.x + bbox.width/2
        y = bbox.y + bbox.height/2

        mouse_x = event.pageX - $('#' + obj.editor.holder_id).offset().left;
        mouse_y = event.pageY - $('#' + obj.editor.holder_id).offset().top;

        //angle droit du triangle rectangle
        p90_x = mouse_x;
        p90_y = y;

        //cos = adjacent / hypothenus
        adjacent =  p90_x - x;
        if(adjacent < 0) 
            adjacent = -adjacent;
        hypothenus = Math.sqrt(adjacent*adjacent + (p90_y - mouse_y)*(p90_y - mouse_y));
        angle = Math.acos(adjacent/hypothenus) * 180 / 3.141592653;

        if(mouse_x <= x && mouse_y <= y) {
            angle = angle - 90;
        } else if(mouse_x >= x && mouse_y <= y) {
            angle = (90 - angle) + 180 + 90 + 90;
        } else if(mouse_x >= x && mouse_y >= y) {
            angle = angle + 90;
        } else if(mouse_x <= x && mouse_y >= y) {
            angle = ( (180 + 90) - angle) + 180 + 90 + 90;
        }

        angle = angle - obj.current_rotation;

        editor_object_rotate(obj, angle);
    },
    up_rotate = function () {
        obj.is_rotate = false;
    };
    object_rotate.drag(move_rotate, start_rotate, up_rotate);
    object_rotate.node.setAttribute("pointer-events", "none");
}


function _editor_object_select_add(obj, object_x, object_y, object_w, object_h, border_size) {
    if(!border_size) {
        border_size = EDITOR_O_BORDER_SIZE;
    }
   var rect = obj.editor.R.rect(
    object_x - border_size,
    object_y - border_size,
    object_w + border_size * 2,
    object_h + border_size * 2
   );

   rect.attr({stroke: "#ccc", fill: "#fff", "fill-opacity": .4, "stroke-width": 2});
   rect.attr({"opacity": 0});
   
   obj.objects.object_select = rect;

   return rect;
}

function _editor_object_create(editor) {
    return {
        'type': null,
        'editor': editor,
        'is_not_in_field': true,
        'is_rotate': false,
        'current_rotation': 0,
        'objects': {
            'object': null,
            'object_select': null,
            'object_rotate': null,
            'controls': null,
            'attached': null,
            'curve_text': null,
            'number': null,
        },
        'number': {
            'number': 0
        },
        'cb': {
            'create_new': null
        },
        'attached': [null, null]
    };
}


function editor_object_rotate(obj, deg) {
    bbox = obj.objects.object.getBBox();
    x = bbox.x + bbox.width/2
    y = bbox.y + bbox.height/2

    obj.current_rotation = (obj.current_rotation + deg) % 360;
    for (i in obj.objects) {
        i = obj.objects[i];
        if(i) {
            i.transform("...R" + deg + ' ' + x + ' ' + y );
        }
    }



    if(obj.objects.attached) {
        for(oa in obj.objects.attached.items) {
            oa = obj.objects.attached.items[oa];  
            bbox = oa.getBBox(); 
            for (o in obj.editor.objects) {
                o = obj.editor.objects[o];
                if(obj.type == EDITOR_O_TRACKB
                    || obj.type == EDITOR_O_TRACKR
                    || obj.type == EDITOR_O_TRACKW
                    || obj.type == EDITOR_O_TRACKY) {
                    index = $.inArray( oa, o.attached );
                    if(index == 0) {
                        bbox2 = o.objects.controls[1].getBBox();
                        o.objects.controls[1].update(
                            bbox.x - bbox2.x, 
                            bbox.y - bbox2.y
                        );
                    } else if(index == 1) {
                        bbox2 = o.objects.controls[4].getBBox();
                        o.objects.controls[4].update(
                            bbox.x - bbox2.x, 
                            bbox.y - bbox2.y
                        );
                    }
                }
            }
        }
    }
}

function editor_object_move(obj, x, y) {
    for (i in obj.objects) {
        i = obj.objects[i];
        if(i) {
            i.transform("...T" + x + "," + y );
        }
    }

    if(obj.objects.attached) {
        for(oa in obj.objects.attached.items) {
            oa = obj.objects.attached.items[oa];   
            for (o in obj.editor.objects) {
                o = obj.editor.objects[o];
                if(o.type == EDITOR_O_TRACKB
                    || o.type == EDITOR_O_TRACKR
                    || o.type == EDITOR_O_TRACKW
                    || o.type == EDITOR_O_TRACKY) {
                    index = $.inArray( oa, o.attached );
                    if(index == 0) {
                        o.objects.controls[1].update(x, y);
                    } else if(index == 1) {
                        o.objects.controls[4].update(x, y);
                    }
                }
            }
        }
    }
}

function editor_object_delete(obj) {
    index = $.inArray( obj, obj.editor.objects );
    obj.editor.objects.splice(index, 1);

    for(o in obj.editor.objects) {
        o = obj.editor.objects[o];
        if( (obj.type == EDITOR_O_TRACKB
            || obj.type == EDITOR_O_TRACKR
            || obj.type == EDITOR_O_TRACKW
            || obj.type == EDITOR_O_TRACKY ) && obj.objects.attached) {
            for(a in obj.objects.attached.items) {
                a = obj.objects.attached.items[a];
                editor_object_detach(o, a);
            }
        }
    }

    if(obj.editor.object_selected = obj) {
        obj.editor.object_selected = null;
    }

    for (i in obj.objects) {
        i = obj.objects[i];
        if(i) {
            i.remove();
        }
    }
}

function editor_object_move_to_top(obj) {
    obj.objects.object_select.toFront();
    obj.objects.object.toFront();
    if(obj.objects.object_rotate) {
        obj.objects.object_rotate.toFront();
    }
    if(obj.objects.curve_text) {
        obj.objects.curve_text.toFront();
    }  
    if(obj.objects.controls) {
        obj.objects.controls.toFront();
    }   
    if(obj.objects.attached) {
        obj.objects.attached.toFront();
    }    
    if(obj.objects.number) {
        obj.objects.number.toFront();
    }    
}



function editor_jump_create(editor) {
    file = editor.static_path + "/obstacles/jump.png";
    
    x = 100;
    y = 50;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_JUMP;
    obj.cb.create_new = editor_jump_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_JUMP_W, EDITOR_O_JUMP_H);

    obj.objects.object = editor.R.image(file, 
        x, 
        y, 
        EDITOR_O_JUMP_W, EDITOR_O_JUMP_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_JUMP_W/2, y-5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_JUMP_W/2, y + EDITOR_O_JUMP_H + 5, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor_object_rotate(obj, 90);

    editor.objects.push(obj);

    return obj;
}

function editor_mur_create(editor) {
    file = editor.static_path + "/obstacles/mur.png";
    
    x = 75;
    y = 45;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_MUR;
    obj.cb.create_new = editor_mur_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_MUR_W, EDITOR_O_MUR_H);

    obj.objects.object = editor.R.image(file, 
        x, 
        y, 
        EDITOR_O_MUR_W, EDITOR_O_MUR_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_MUR_W/2, y-5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_MUR_W/2, y + EDITOR_O_MUR_H + 5, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor_object_rotate(obj, 90);

    editor.objects.push(obj);

    return obj;
}

function editor_pneu_create(editor) {
    file = editor.static_path + "/obstacles/pneu.png";
    
    x = 60;
    y = 140;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_PNEU;
    obj.cb.create_new = editor_pneu_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_PNEU_W, EDITOR_O_PNEU_H);

    obj.objects.object = editor.R.image(file, 
        x, 
        y, 
        EDITOR_O_PNEU_W, EDITOR_O_PNEU_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_PNEU_W/2, y-5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_PNEU_W/2, y + EDITOR_O_PNEU_H + 5, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor_object_rotate(obj, 90);

    editor.objects.push(obj);

    return obj;
}

function editor_oxer_create(editor) {
    file = editor.static_path + "/obstacles/oxer.png";
    
    x = 52;
    y = 220;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_OXER;
    obj.cb.create_new = editor_oxer_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_OXER_W, EDITOR_O_OXER_H);

    obj.objects.object = editor.R.image(file, 
        x, 
        y, 
        EDITOR_O_OXER_W, EDITOR_O_OXER_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_OXER_W/2, y-5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_OXER_W/2, y + EDITOR_O_OXER_H + 5, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor_object_rotate(obj, 90);

    editor.objects.push(obj);

    return obj;
}

function editor_longueur_create(editor) {
    file = editor.static_path + "/obstacles/longueur.png";
    
    x = 52;
    y = 280;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_LONGUEUR;
    obj.cb.create_new = editor_longueur_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_LONGUEUR_W, EDITOR_O_LONGUEUR_H);

    obj.objects.object = editor.R.image(file, 
        x, 
        y, 
        EDITOR_O_LONGUEUR_W, EDITOR_O_LONGUEUR_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_LONGUEUR_W/2, y-5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_LONGUEUR_W/2, y + EDITOR_O_LONGUEUR_H + 5, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor_object_rotate(obj, 90);

    editor.objects.push(obj);

    return obj;
}

function editor_chaussette_create(editor) {
    file = editor.static_path + "/obstacles/chaussette.png";
    
    x = 30;
    y = 340;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_CHAUSSETTE;
    obj.cb.create_new = editor_chaussette_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_CHAUSSETTE_W, EDITOR_O_CHAUSSETTE_H);

    obj.objects.object = editor.R.image(file, 
        x, 
        y, 
        EDITOR_O_CHAUSSETTE_W, EDITOR_O_CHAUSSETTE_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x - 5, y + EDITOR_O_CHAUSSETTE_H/2, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_CHAUSSETTE_W + 5, y + EDITOR_O_CHAUSSETTE_H/2, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);

    return obj;
}

function editor_table_create(editor) {
    file = editor.static_path + "/obstacles/table.png";
    
    x = 20;
    y = 288;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_TABLE;
    obj.cb.create_new = editor_table_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_TABLE_W, EDITOR_O_TABLE_H);

    obj.objects.object = editor.R.image(file, 
        x, 
        y, 
        EDITOR_O_TABLE_W, EDITOR_O_TABLE_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_TABLE_W/2, y-5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_TABLE_W/2, y + EDITOR_O_TABLE_H + 5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x - 5, y + EDITOR_O_TABLE_H/2, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_TABLE_W + 5, y + EDITOR_O_TABLE_H/2, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);

    return obj;
}

function editor_A_create(editor) {
    file = editor.static_path + "/obstacles/A.png";

    x = 80;
    y = 142;
    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_A;
    obj.cb.create_new = editor_A_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_A_W, EDITOR_O_A_H);

    obj.objects.object = editor.R.image(file,
        x, 
        y, 
        EDITOR_O_A_W, EDITOR_O_A_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x - 5, y + EDITOR_O_A_H/2, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_A_W + 5, y + EDITOR_O_A_H/2, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);

    editor_object_rotate(obj, 90);
    return obj;
}

function editor_slalom_create(editor) {
    file = editor.static_path + "/obstacles/slalom.png";

    x = -55;
    y = 90;
    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_SLALOM;
    obj.cb.create_new = editor_slalom_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_SLALOM_W, EDITOR_O_SLALOM_H);

    obj.objects.object = editor.R.image(file,
        x, 
        y, 
        EDITOR_O_SLALOM_W, EDITOR_O_SLALOM_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_SLALOM_H , y + EDITOR_O_SLALOM_H + 5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_SLALOM_W - EDITOR_O_SLALOM_H - 1, y - 5, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);

    editor_object_rotate(obj, 90);
    return obj;
}

function editor_slalom_x6_create(editor) {
    file = editor.static_path + "/obstacles/slalom_x6.png";

    x = -20;
    y = 220;
    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_SLALOM_X6;
    obj.cb.create_new = editor_slalom_x6_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_SLALOM_X6_W, EDITOR_O_SLALOM_X6_H);

    obj.objects.object = editor.R.image(file,
        x, 
        y, 
        EDITOR_O_SLALOM_X6_W, EDITOR_O_SLALOM_X6_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x + EDITOR_O_SLALOM_X6_H , y + EDITOR_O_SLALOM_X6_H + 5, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_SLALOM_X6_W - EDITOR_O_SLALOM_X6_H - 1, y - 5, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);

    editor_object_rotate(obj, 90);
    return obj;
}

function editor_passerelle_create(editor) {
    file = editor.static_path + "/obstacles/passerelle.png";

    x = -75;
    y = 135;
    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_PASSERELLE;
    obj.cb.create_new = editor_passerelle_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_PASSERELLE_W, EDITOR_O_PASSERELLE_H);

    obj.objects.object = editor.R.image(file,
        x, 
        y, 
        EDITOR_O_PASSERELLE_W, EDITOR_O_PASSERELLE_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x - 5, y + EDITOR_O_PASSERELLE_H/2, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_PASSERELLE_W + 5, y + EDITOR_O_PASSERELLE_H/2, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);
    editor_object_rotate(obj, 90);    editor_object_rotate(obj, 90);    editor_object_rotate(obj, 90);
    return obj;
}

function editor_balance_create(editor) {
    file = editor.static_path + "/obstacles/balance.png";

    x = 30;
    y = 60;
    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_BALANCE;
    obj.cb.create_new = editor_balance_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_BALANCE_W, EDITOR_O_BALANCE_H);

    obj.objects.object = editor.R.image(file,
        x, 
        y, 
        EDITOR_O_BALANCE_W, EDITOR_O_BALANCE_H
    );

    obj.objects.attached = editor.R.set(
        editor.R.circle(x - 5, y + EDITOR_O_BALANCE_H/2, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x + EDITOR_O_BALANCE_W + 5, y + EDITOR_O_BALANCE_H/2, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    _editor_action_rotate_add(obj);
    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);

    editor_object_rotate(obj, 90);
    return obj;
}

function editor_tunnel_create(editor) {
    x = 120;
    y = 220;

    x_end = 120;
    y_end = y + EDITOR_O_TUNNEL_H;

    var obj = _editor_object_create(editor);
    obj.type = EDITOR_O_TUNNEL;
    obj.cb.create_new = editor_tunnel_create;

    obj.objects.object_select = _editor_object_select_add(obj, x - EDITOR_O_TUNNEL_R/2, y, EDITOR_O_TUNNEL_R, EDITOR_O_TUNNEL_H);

    object_controls = editor_curve(obj, x, y, x+20, y+20, x_end-20, y_end-20, x_end, y_end, "#f89406", EDITOR_O_TUNNEL_R, is_arrow_end=false);


    obj.objects.attached = editor.R.set(
        editor.R.circle(x, y, 5).attr({fill: "#fff", stroke: "none"}),
        editor.R.circle(x_end, y_end, 5).attr({fill: "#fff", stroke: "none"})
    );
    obj.objects.attached.attr({"opacity": 0});
    for(i in obj.objects.attached.items) {
        obj.objects.attached[i].node.setAttribute("pointer-events", "none");
    }

    obj.objects.object = object_controls[0];
    obj.objects.controls = object_controls[1];

    _editor_action_move_add(obj);
    _editor_action_select_add(obj);
    editor_curve_length(obj);

    editor.objects.push(obj);

    return obj;
}

function editor_trackb_create(editor) {
    return _editor_track_create(editor, EDITOR_O_TRACKB, "#000000", editor_trackb_create, 55, 438);
}

function editor_trackw_create(editor) {
    return _editor_track_create(editor, EDITOR_O_TRACKW, "#ffffff", editor_trackw_create, 55, 488);
}

function editor_trackr_create(editor) {
    return _editor_track_create(editor, EDITOR_O_TRACKR, "#FF0000", editor_trackr_create, 55, 538);
}

function editor_tracky_create(editor) {
    return _editor_track_create(editor, EDITOR_O_TRACKY, "#e5d51c", editor_tracky_create, 55, 588);
}

function _editor_track_create(editor, type, color, cb_create, x, y) {
    x_end = x + EDITOR_O_TRACK_W;
    y_end = y + EDITOR_O_TRACK_H;

    var obj = _editor_object_create(editor);
    obj.type = type;
    obj.cb.create_new = cb_create;

    obj.objects.object_select = _editor_object_select_add(obj, x - EDITOR_O_TRACK_R/2, y, EDITOR_O_TRACK_R, EDITOR_O_TRACK_H);

    object_controls = editor_curve(obj, x, y, x+20, y-20, x_end - 20, y_end+20, x_end, y_end, color, EDITOR_O_TRACK_R, is_arrow_end=true);

    obj.objects.object = object_controls[0];
    obj.objects.controls = object_controls[1];

    _editor_action_move_add(obj);
    _editor_action_select_add(obj);
    editor_curve_length(obj);

    editor.objects.push(obj);

    return obj;
}

function editor_numberb_create(editor) {
    return _editor_number_create(editor, EDITOR_O_NUMBERB, 'number.png', 'number_trash.png', editor_numberb_create, 10, 420);
}

function editor_numberw_create(editor) {
    return _editor_number_create(editor, EDITOR_O_NUMBERW, 'numberw.png', 'numberw_trash.png', editor_numberw_create, 10, 470);
}

function editor_numberr_create(editor) {
    return _editor_number_create(editor, EDITOR_O_NUMBERR, 'numberr.png', 'numberr_trash.png', editor_numberr_create, 10, 520);
}

function editor_numbery_create(editor) {
    return _editor_number_create(editor, EDITOR_O_NUMBERY, 'numbery.png', 'numbery_trash.png', editor_numbery_create, 10, 570);
}

function _editor_number_number_set(obj, number) {
    obj.number.number = number;
    obj.objects.number.attr({'text': number});
    bbox = obj.objects.object.getBBox();
    if(number < 10) {
        obj.objects.number.attr({'x': bbox.x + 5});
    } else {
        obj.objects.number.attr({'x': bbox.x + 2});
    }
}

function _editor_number_create(editor, type, image, image_trash, cb_create, x, y) {
    file = editor.static_path + "/" + image;

    var obj = _editor_object_create(editor);
    obj.type = type;
    obj.cb.create_new = cb_create;

    obj.objects.object_select = _editor_object_select_add(obj, x, y, EDITOR_O_NUMBER_W, EDITOR_O_NUMBER_H, 3);

    obj.objects.object = editor.R.image(file,
        x, 
        y, 
        EDITOR_O_NUMBER_W, EDITOR_O_NUMBER_H
    );

    //recherche du nombre
    max = 0;
    for (o in editor.objects) {
        o = editor.objects[o];
        if(o.type == type && o.number.number > max) {
            max = o.number.number;
        }
    }
    obj.number.number = max + 1;

    text = editor.R.text(x + EDITOR_O_NUMBER_W / 4, y + EDITOR_O_NUMBER_H / 2, obj.number.number).attr({"text-anchor" : "start", "fill": '#000', "font-weight": "bold", "font-size": 9});
    text.node.setAttribute("pointer-events", "none");
    obj.objects.number = text;

    _editor_number_number_set(obj, obj.number.number);

    _editor_action_move_add(obj);
    _editor_action_select_add(obj);

    editor.objects.push(obj);

    if(!editor.number_trash[type]) {
        editor.number_trash[type] = editor.R.image(editor.static_path + "/" + image_trash,
            x, 
            y + EDITOR_O_NUMBER_H + 5, 
            EDITOR_O_NUMBER_W, EDITOR_O_NUMBER_H
        );
        editor.number_trash[type].node.setAttribute("cursor", "pointer");
        editor.number_trash[type].mousedown(function(){
            max = 0;
            max_o = null;
            for (o in editor.objects) {
                o = editor.objects[o];
                if(!o.is_not_in_field && o.type == type && o.number.number > max) {
                    max = o.number.number;
                    max_o = o;
                }
            }
            if(max_o) {
                editor_object_delete(max_o);

                //maintenant qu'il est supprimé on recherche le max
                max = 0;
                max_o = null;
                for (o in editor.objects) {
                    o = editor.objects[o];
                    if(!o.is_not_in_field && o.type == type && o.number.number > max) {
                        max = o.number.number;
                        max_o = o
                    }
                }   

                for (o in editor.objects) {
                    o = editor.objects[o];
                    if(o.is_not_in_field && o.type == type) {
                        _editor_number_number_set(o, max + 1);
                    }
                }
            }
        });
    }

    return obj;
}