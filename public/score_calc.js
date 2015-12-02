//
// score_calc.js
//
////////////////////////////////////////////////////////////////

var result = {
    displine: "Men", segment: "SP",
    elements: {
	jumps: [],
	spins: [],
	stsq: [],
	chsq: [],
    },
    components: {
	"SS": {name: "Skating Skills"}
    },
    tes: { bv: 0, goesov: 0, score: 0}
}
////////////////////////////////////////////////////////////////
// utils
function normalize_float(f){
    // return parseFloat(parseInt(f*100)/100);
    return parseFloat(f).toFixed(2)
}
function getval(category, num, selector){
    return $("#" + category + num + " " + selector).val() || "";
}
function gettext(category, num, selector){
    return $("#" + category + num + " " + selector).text();
}
function settext(category, num, selector, text){
    return $("#" + category + num + " " + selector).text(text);
}

// jump
function rev(jname){
    return jname.charAt(0)
}
function jname_wo_rev(jname){
    return jname.charAt(1) + jname.charAt(2);
}
function is_axel(jname){
    if (jname.charAt(1) == "A") { return true; } else { return false; }
}
function dg_jump(jname){
    r = rev(jname)
    if (r == 1){
	return "novalue"
    } else {
	dg_rev = r - 1
	return dg_rev + jname_wo_rev(jname);
    }
}
////////////////////////////////////////////////////////////////
function parse_elements(){
    result.tes.bv = result.tes.goesov = result.tes.score = 0;

    // jump
    for (var i=1; i<=8; i++){
	jump = { 
	    type: "solo", is_comb: false, num_jumps: 1, executed: [], bv: 0, goesov: 0, score: 0
	}
	// type
	jump.type = getval("jump", i, ".type")
	
	if (jump.type != "solo"){
	    jump.is_comb = true;
	    if (jump.type == "comb2"){ jump.num_jumps = 2} else { jump.num_jumps = 3}
	}
	var ar = ["", "first", "second", "third"];
	for (var j=1; j<=3; j++){
	    each_jump = {
		jname: getval("jump", i, "." + ar[j] + " .jname"),
		edge: getval("jump", i, "." + ar[j] + " .edge"),
		ur: getval("jump", i, "." + ar[j] + " .ur")
	    }
	    // edge check; !/e shd apply only to Lz or F
	    jn = jname_wo_rev(each_jump.jname)
	    if (jn != "Lz"&& jn != "F"){ each_jump.edge = "" }

	    jump.executed[j] = each_jump;
	}
	// name
	var name = "";
	for (var j=1; j<= jump.num_jumps; j++){
	    if (j>1) name += "-"
	    name += jump.executed[j].jname + jump.executed[j].edge + jump.executed[j].ur
	}
	jump.name = name
	jump.credit = getval("jump", i, ".credit")
	jump.goe = getval("jump", i, ".goe")

	// bv
	var sum_bv = 0;
	var max_bv = 0;
	var max_bv_jname = "";

	for (var j=1; j<=jump.num_jumps; j++){
	    var jname = jump.executed[j].jname
	    if (bvsov[jname] === undefined) break;

	    var v = 0;
	    var bv = 0;

	    // downgrade
	    if (jump.executed[j].ur == "<<"){ jname = dg_jump(jname) }
	    if (jump.executed[j].ur == "<") v += 1
	    if (jump.executed[j].edge == "e") v += 1
	    switch (v){
	    case 0:
	    	bv = bvsov[jname].bv; break;
	    case 1:
		bv = bvsov[jname].v; break;
	    case 2:
		bv = bvsov[jname].v1; break;
	    }
	    bv = parseFloat(bv);

	    if (max_bv < bv) {  max_bv = bv; max_bv_jname = jname; }
	    sum_bv += parseFloat(bv);
	}
	// credit
	if (jump.credit == "x"){ sum_bv *= 1.1; }
	if (sum_bv > 0){
	    jump.bv = parseFloat(sum_bv);
	    jump.goesov = parseFloat(bvsov[max_bv_jname].sov[jump.goe]);
	    jump.score = jump.bv + jump.goesov;

	    result.tes.bv += jump.bv;
	    result.tes.goesov += jump.goesov;
	    result.tes.score += jump.score;
	}
	result.elements.jumps[i] = jump;
    }
    
    // spin
    for (var i=1; i<=3; i++){
	name = getval("spin", i, ".flying") + getval("spin", i, ".changefoot") + getval("spin", i, ".position") + getval("spin", i, ".level");
	spin = { name: name, goe: getval("spin", i, ".goe"), bv: 0, goesov: 0, score: 0}

	// score
	if (! (bvsov[name] === undefined)){
	    spin.bv = parseFloat(bvsov[name].bv)
	    spin.goesov = parseFloat(bvsov[name].sov[spin.goe])
	    spin.score = spin.bv + spin.goesov
	}

	result.elements.spins[i] = spin;
	result.tes.bv += spin.bv;
	result.tes.goesov += spin.goesov;
	result.tes.score += spin.score;

    }
    // stsq
    for (var i=1; i<=1; i++){
	name = getval("stsq", i, ".sname");
	goe = getval("stsq", i, ".goe")
	stsq = { name: name, goe: goe, bv: 0, goesov: 0, score: 0 }

	if (! (bvsov[name] === undefined)){
	    stsq.bv = normalize_float(bvsov[name].bv)
	    stsq.goesov = normalize_float(bvsov[name].sov[goe])
	    stsq.score = normalize_float(parseFloat(stsq.bv) + parseFloat(stsq.goesov))
	}
	result.elements.stsq[i] = stsq;

	result.tes.bv += stsq.bv;
	result.tes.goesov += stsq.goesov;
	result.tes.score += stsq.score;
    }
    // chsq
    for (var i=1; i<=1; i++){
	name = getval("chsq", i, ".cname")
	goe = getval("chsq", i, ".goe")
	chsq = { name: name, goe: goe , bv: 0, goesov: 0, score: 0}
	
	if (! (bvsov[name] === undefined)){
	    chsq.bv = normalize_float(bvsov[name].bv)
	    chsq.goesov = normalize_float(bvsov[name].sov[goe])
	    chsq.score = normalize_float(parseFloat(chsq.bv) + parseFloat(chsq.goesov))
	}
	result.elements.chsq[i] = chsq;

	result.tes.bv += chsq.bv;
	result.tes.goesov += chsq.goesov;
	result.tes.score += chsq.score;
    }

    // result.elements.chsq[1] = { name: getval("chsq", 1, ".name"), goe: getval("chsq", 1, ".goe") }

    // tes total
}

function update_element(type, i, elem){
    settext(type, i, ".name", elem.name);
    settext(type, i, ".bv", elem.bv);
    settext(type, i, ".goesov", elem.goesov);
    settext(type, i, ".score", elem.score);
}

function update_elements(){
    // jump
    for (var i=1; i<=8; i++){
	elem = result.elements.jumps[i];

	vis = ['', 'visible', 'visible', 'visible']
	if (elem.num_jumps < 3) { vis[3] = 'hidden'; }
	if (elem.num_jumps < 2) { vis[2] = 'hidden'; }	
	
	$("#jump" + i + " .first").css("visibility", vis[1]);
	$("#jump" + i + " .second").css("visibility", vis[2]);
	$("#jump" + i + " .third").css("visibility", vis[3]);
	
	update_element("jump", i, elem);
    }
    // spin
    for (var i=1; i<=3; i++){
	update_element("spin", i, result.elements.spins[i]);
    }
    // stsq
    for (var i=1; i<=1; i++){
	update_element("stsq", i, result.elements.stsq[i]);
    }
    // chsq
    for (var i=1; i<=1; i++){
	update_element("chsq", i, result.elements.chsq[i]);
    }
    // tes total
    settext("tes", "", ".bv", normalize_float(result.tes.bv));
    settext("tes", "", ".goesov", normalize_float(result.tes.goesov));
    settext("tes", "", ".score", normalize_float(result.tes.score));
}

function recalc(){
    parse_elements();

    update_elements();
    // parse_components();

    // check_errors();
}
