//#include include/glitchmas_2011.js, include/takeable.js

var label = "Glitchmas Cracker Joke";
var version = "1346778856";
var name_single = "Glitchmas Cracker Joke";
var name_plural = "Glitchmas Cracker Jokes";
var article = "a";
var description = "A joke of dubious quality found in a Glitchmas Cracker. Who writes these things, anyway?";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1;
var input_for = [];
var parent_classes = ["glitchmas_cracker_joke", "note", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.initial_text = "";	// defined by note
	this.instanceProps.initial_title = "";	// defined by note
}

var instancePropsDef = {
	initial_text : ["Initial text to show on this note, from no author"],
	initial_title : ["Initial title to show on this note, from no author"],
};

var instancePropsChoices = {
	initial_text : [""],
	initial_title : [""],
};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.write_on = { // defined by glitchmas_cracker_joke
	"name"				: "write on",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Change what it says",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// You can't write on jokes
		return {state: null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'write on', 'wrote on', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.read = { // defined by note
	"name"				: "read",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "What does it say?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'teleportation_script') return {state:null};

		if (!this.contents && !this.getInstanceProp('initial_text')) return {state:'disabled', reason: "It is blank :("};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.readNote(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_note_write_on(pc, msg, suppress_activity){
	var rsp = {
	    type: "note_view",
	    title: this.title ? this.title : "A note!",
	    body: this.contents,
	    start_in_edit_mode: true,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: intval(this.last_edited),
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);

	return true;
};

function parent_verb_note_write_on_effects(pc){
	// no effects code in this parent
};

function onCreate(){ // defined by glitchmas_cracker_joke
	this.initInstanceProps();
	this.contents = '';
	this.title = '';
	this.last_editor = null;
	this.last_edited = 0;
	this.history = [];

	this.choices = this.getJokes();

	var note = choose_one(this.choices);

	this.contents = "Question: "+note.question+"\nAnswer: "+note.answer;
	this.title = "Glitchmas Cracker Joke";
}

function onInputBoxResponse(pc, uid, body, title, msg){ // defined by glitchmas_cracker_joke
	if (this.last_editor && this.last_editor != pc.tsid) return;

	this.setInstanceProp('initial_text', '');
	this.setInstanceProp('initial_title', '');

	body = str(body);
	title = str(title);
	if (uid != 'teleportation_script_create' && this.contents == body && this.title == title) return;
	title = title.substr(0, 150);
	body = body.substr(0, 1000);

	this.contents = body;
	this.title = title;
	this.last_editor = pc.tsid;
	this.last_edited = time();

	this.history.push({title: title, body: body, editor: pc.tsid});
	if (this.history.length > 10){
		array_remove(this.history, 0, this.history.length-10);
	}
}

function onNoteClose(pc){ // defined by glitchmas_cracker_joke
	log.info('***** onNoteClose');

	var xp = pc.stats_add_xp(10, true);
	var message = 'The Joke was so funny, so hilarious, so gut-bustingly droll that it fell apart in your hand. Oh well. At least you enjoyed it.';

	if (xp > 0) { 
		message += ' You received '+xp+' XP.';
	}

	pc.sendActivity(message);
	this.apiDelete();
}

function readNote(pc){ // defined by glitchmas_cracker_joke
	var disabled_reason ="You can't edit a joke";

	if (this.getInstanceProp('initial_text')){
		this.contents = this.getInstanceProp('initial_text').replace(/\\n/g, "\n").replace(/&quot;/g, "\"");
	}

	if (this.getInstanceProp('initial_title')){
		this.title = this.getInstanceProp('initial_title');
	}

	var rsp = {
	    type: "note_view",
	    title: this.title? this.title : "A joke!",
	    body: utils.filter_chat(this.contents),
	    disabled_reason: disabled_reason,
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);
}

function canPickup(pc){ // defined by note
	var c_type = this.getContainerType();
	if (c_type == 'street' && this.container.isGreetingLocation()){
		return {ok: 0};
	}

	return {ok: 1};
}

function getLabel(){ // defined by note
	if (this.class_tsid == 'note'){
		var container = this.container;
		if (container && container.is_bag){
			return this.title ? '[Note] '+this.title : this.label;
		}
	}

	return this.title ? this.title : this.label;
}

function parent_onCreate(){ // defined by note
	this.contents = '';
	this.title = '';
	this.last_editor = null;
	this.last_edited = 0;
	this.history = [];
}

function parent_onInputBoxResponse(pc, uid, body, title, msg){ // defined by note
	if (this.last_editor && this.last_editor != pc.tsid) return;

	function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
	var quill = pc.findFirst(is_quill);
	if (!quill){
		pc.sendActivity("You don't have a working quill anymore!");
		return;
	}
	quill.use();

	this.setInstanceProp('initial_text', '');
	this.setInstanceProp('initial_title', '');

	body = str(body);
	title = str(title);
	if (uid != 'teleportation_script_create' && this.contents == body && this.title == title) return;
	title = title.substr(0, 150);
	body = body.substr(0, 1000);

	this.contents = body;
	this.title = title;
	this.last_editor = pc.tsid;
	this.last_edited = time();

	this.history.push({title: title, body: body, editor: pc.tsid});
	if (this.history.length > 10){
		array_remove(this.history, 0, this.history.length-10);
	}

	if (uid == 'teleportation_script_create'){
		var loc_info = pc.location.get_info();
		this.destination = {
			tsid: pc.location.tsid,
			x: pc.x,
			y: pc.y,
			name: loc_info.name,
			mote_name: loc_info.mote_name
		};

		if (msg.is_imbued && pc.teleportation_get_token_balance()){
			this.is_imbued = true;
			pc.teleportation_spend_token("Imbueing a Teleportation Script to "+pc.location.label+".");
		}

		pc.prompts_add({
			txt		: "You've created a Teleportation Script! You can give it to anybody you like.",
			icon_buttons	: false,
			timeout		: 15,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
}

function parent_readNote(pc){ // defined by note
	var disabled_reason ='';
	if (pc.skills_has('penmanship_1')){
		function is_quill(it){ return it.class_tsid == 'quill' && it.isWorking() ? true : false; }
		if (!pc.items_has(is_quill, 1)){
			disabled_reason = "You need a working quill.";
		}
	}
	else{
		disabled_reason = "You need to know Penpersonship.";
	}

	if (this.last_editor != pc.tsid) disabled_reason = 'This is not your note.';

	if (this.disabled_reason) {
		disabled_reason = this.disabled_reason;
	}

	if (this.getInstanceProp('initial_text')){
		this.contents = this.getInstanceProp('initial_text').replace(/\\n/g, "\n").replace(/&quot;/g, "\"");
	}

	if (this.getInstanceProp('initial_title')){
		this.title = this.getInstanceProp('initial_title');
	}

	var rsp = {
	    type: "note_view",
	    title: this.title? this.title : "A note!",
	    body: this.contents,
	    disabled_reason: disabled_reason,
	    start_in_edit_mode: false,
	    itemstack_tsid: this.tsid,
	    pc: this.last_editor ? getPlayer(this.last_editor).make_hash() : {},
	    updated: this.last_edited,
	    max_chars: 1000
	};

	pc.apiSendMsg(rsp);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_discovery_dialog",
	"glitchmas",
	"toys",
	"bureaucracy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-17,"w":29,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFh0lEQVR42u2Ye0xbdRTHt4kJKorG\n+SK+5oMBcZHoH7pIxFeMC+pCfC\/GGWOM+sf4wzgTidsfkuimiGNhIZkTMBA2wgZ7CMtoeW5QSukt\npa\/b123pA9pCS3lmmuV4zo97yy0g\/0C7\/cFNvqGUW\/rp95zz\/R3YtGnj2rgWr3DYkR4a5Q\/eEDAA\n4fT5aU9+aNSWH\/Rbiggs6LMIIb8Fxn2W3dfBGVs+QYyP8U1TEwI3O+mG6bAABLRUCFqVNLipcUfT\nShCTITtEgjYYH+VhJuJizwW8JvC7DQhoBvpQSSslQnILbz4MoyMGGPMY42BtxsswPKhAKcFt52DE\noYNRj\/FgUvvt2pwvMoZwBCCJnCLAP4\/9APVVP0Nv5xn2vJPXgN2sBpeNS1qpUwSL+o1\/Z73MRQmQ\nnPI4h5hsJhW0Nh9nX+UfwufSJxwyBbUVdW\/AYzhMkFajCqym\/jgQcq\/80D5orPuNuUnw1BasDZIQ\nPTHIf2a97vAYD4P9StBpOsGs741J8XcNA+zvOcuGR96n+P3eZEDedfHCqZevzftBsGoYpFxcfxuU\nlnwJp+tKgWIoOu5chPSZI5EA\/3SiITej7va6uOL5qCsOjhz0CnqWjWMjQ9B1qRYM2rZYVlK5ccgE\nv1P7SFLKPR91D5OL3EAHm1jqQ4u+k8FJgOEAz5yknMRhAYOuBzQqhaDRtCU8I2+hUs9FXZOCdZDB\naVWtrLzavvMMSq5wwMbukdzW9Cu4ZECm6TTt30QC1lgmmoc64EJjxTI4CnZyOa5nVcqqZEDeIfDq\nmjBCSsPQfKqc9R6VleCk\/iOnla31TFp1Owxz3eDgNU3JOBK3RUM2ywRGD4EYuQ5QXz4HypaauJih\nI\/JERTG6PbiYj+J0U04mEvTmr77YWzA76ZoiCDrmOLUSutpO4mT3sOEgkIkxK4NuPlm+4gbEQP2W\nJlrdEhFHW2urjhZfnR5hpaTIOd9YCWcbKlh\/Uh5KPWkzdrPpPnq4CAReBVMTTqbouAPkrSIBr+du\nuV2nVp7B+GFvYNF3QeXv+6H2jxKwm65AdeWBuOHp62xkUeS2qVksSc9T79IHkvqX5HXpBfygaz6J\nbkLtDPlNztmIwFwJ+kw4MAosd33sdFkqgiRJzsp\/RqDUr7Izf82Qabm5O3YHvQYhigutfBjqTpQw\nkOUZybOppwylHqVFmEotneW0AEuALjsXGXUb1gyZsueDwg\/RxRlazWiroSNQr7kEmt5zcXBUTtrK\naYCkOPIKC+sbtYgPH1O+0uultc483EunUdGa8zEnZ\/vHfteQiwAlByiwCYhckpySIojeXL6+VZZ9\nG7tPLupNuj\/gNXL42rK1QKZnZ2d+4nFo3Q7LAJts2iHt5gEWPZK7cihJ5GLDX7+wQVqpb2kBQdfX\nZTvKQO1RX7nYQzvksLZ72YrGG\/pYdsoBqe88zkF2rtP0y6c8BhkR8tcrfmi9+qj00IGySJAPzYSd\ntHahi0OAJxDMTbpWdJDKL+XmUkCbRf01\/s4t6xnkj6PeJ9Dv9+8r4dSKblp6SVenPf9TZj32nCN+\nqMJCVNHS8C5t9uKGv3k9IXNRhah3UO9lZT35afPp6ipcfGfwz9plcFI80YTTYISDVlNtzbFd+Nr7\nRMA7E7HovoAqQL2Jeou+Fr696zM8s9uo9FRaGhyKFlo+FibeFu3rafkO730U9YDMvS2JWCzSUC+i\nXpPpVdQrR379sQjP8imp9Nin7TqN8qeCgtefFeEyZHApiVzPbkXRm+aJjpJ2op7Ly3v+perjRz7H\nxztQWagnxCHLEMFuW+++W+3czhZBnxH7kzLtKfH5TNRjqIdE11Kv13\/x7kHliG5lio5tQz2Muh91\ne7IcW+1KFYFID4qlTL0RwJZt5omazI1rtes\/dOvnZcqzuFgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/glitchmas_cracker_joke-1334255517.swf",
	admin_props	: true,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_discovery_dialog",
	"glitchmas",
	"toys",
	"bureaucracy"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "read"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "read",
	"t"	: "write_on"
};

log.info("glitchmas_cracker_joke.js LOADED");

// generated ok 2012-09-04 10:14:16 by tim
