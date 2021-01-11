window.onload = chooseOptions
var options_set = false
var suggestion_on = true
var ground_triple = true
var tripdexes = []
var types = []
var api_address = 'http://127.0.0.1:8000/api/survey'

gtype = genRanNums(16, 1)[0]

for (i = 0; i < 12; i++) {
    types.push('pair')
}
for (i = 0; i < 3; i++) {
    types.push('triple')
}
types.push('tripset' + gtype)
types.push('titanic')

console.log(types)

function chooseOptions() {
    //  set_text('q0',0,random_story)

    pair_nums = genRanNums(2000, 12)
    triple_nums = genRanNums(1000, 4)

    tt = shuffle(types)

    counters = { 'pair': 0, 'triple': 0 }

    tripleset = genRanNums(4, 1)[0]
    idx = 0
    for (k = 0; k < tt.length; k++) {

        if (tt[k] == 'pair') {
            rindex = pair_nums[counters[tt[k]]]
        } else if (tt[k] == 'triple') {
            rindex = triple_nums[counters[tt[k]]]
        } else {
            rindex = 0
            // if(tt[k].includes('tripset')){
            //   console.log('special tripset at: ', k)
            //   idx = k
            // }
        }
        makeq(k, rindex, tt[k])
        // console.log('type: '+tt[k]+' chosen: '+rindex)
        if (tt[k] != 'titanic') {
            counters[tt[k]]++
        }
    }

    // console.log(counters)

    document.getElementById("gender").selectedIndex = 0
    document.getElementById("education").selectedIndex = 0
    document.getElementById("agegroup").selectedIndex = 0

    document.getElementById('scenario_index').innerHTML = '1/' + (types.length + 1)

    options_set = true

    //  use this functions to skip pages to debug
    //  accept()
    //  showsurvey()

    //  for(i=0;i<idx;i++){
    //   next()
    //  }
}
// sample code for fetching 
fetch(url, {
    method: 'POST',
    body: JSON.stringify({
        'unique_id': 'test_uni',
        'survey_type': 'pair'
    })
}).then(r => r.json()).then(r => console.log(r))

function next() {
    var questions = []
    for (i = 0; i < types.length + 1; i++) {
        questions.push(document.getElementById('q' + i.toString()))
    }
    var show_index

    for (i = 0; i < questions.length; i++) {
        if (questions[i].style.display != 'none' && i < questions.length - 1) {

            document.getElementById('prompt').style.display = 'block'
            show_index = i + 2
            questions[i].style.display = 'none'
            questions[i + 1].style.display = 'block'
            document.getElementById('scenario').scrollIntoView()
            document.getElementById('scenario_index').innerHTML = (show_index).toString() + '/' + (questions.length).toString()
            document.getElementById('scenario').innerHTML = 'Scenario ' + show_index
            //  if(i == questions.length-4){ setfeatureq()}
            if (i == questions.length - 2) {
                document.getElementById('nextbtn').disabled = true
                if (suggestion_on) {
                    document.getElementById('scenario').innerHTML = 'Final Question'
                    document.getElementById('prompt').style.display = 'none'
                }
            }
            break
        }
    }
}

function accept() {
    document.getElementById("consentform").style.display = 'none'
    document.getElementById('survey').style.display = 'block'
    if (!options_set) {
        chooseOptions()
    }
}

function goback() {
    window.history.back()
}

function genRanNums(thres, count) {
    arr = []
    arr.push(Math.floor(Math.random() * thres))
    while (arr.length < count) {
        n = Math.floor(Math.random() * thres)
        while (arr.includes(n)) {
            n = Math.floor(Math.random() * thres)
        }
        arr.push(n)
    }
    return arr
}

function wordcount(box, vv) {
    words = vv.split(/\b\W+\b/)
    if (words.length == 1 && $.trim(words[0]).length == 0) {
        box.innerHTML = '<small>' + 0 + '</small>'
    } else {
        box.innerHTML = '<small>' + words.length + '</small>'
    }
}

function showsurvey() {
    document.getElementById('demographics').style.display = 'none'
    // document.getElementById('attention').style.display='none'
    document.getElementById('realsurvey').style.display = 'block'
}

function showacheck() {
    document.getElementById('demographics').style.display = 'none'
    document.getElementById('attention').style.display = 'block'
}

function get_randomkey() {
    var result = '';
    var alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (i = 0; i < 12; i++) {
        result += alph[Math.floor(Math.random() * alph.length)]
    }
    return result
}

/**
* Shuffles array in place.
* @param {Array} a items An array containing the items.
*/
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function makeq(index, randnum, type) {
    explanation = {
        // 'age': 'Age of the person',
        // 'health': 'Health status of the person',
        // 'gender': 'Gender of the person',
        // 'income level': 'Income level of the person',
        // 'education level': 'Highest level of education the person received',
        // 'number of dependents': 'Number of people the person supports',
        // 'survival with jacket': 'Survival chance when given the jacket',
        // 'survival without jacket': 'Survival chance when not given the jacket',
        'age': 'age',
        'health': 'health',
        'gender': 'gender',
        'income level': 'income',
        'number of dependents': '#dependents',
        'if chosen': 'Survival chance when given the jacket',
        'if not chosen': 'Survival chance when not given the jacket',
    }

    clr = ['red', 'blue', 'green', 'purple']
    ops = ['A', 'B', 'C', 'D']
    var questions;
    if (type == 'pair') {
        questions = pairs_story
    } else if (type == 'triple') {
        questions = triples_story
    } else if (type.includes('tripset')) {
        questions = eval(type + '_story')
        randnum = 0
    } else {
        questions = titanic_story
    }

    newdiv = document.createElement('div')
    qq = 'q' + index.toString()
    newdiv.id = qq
    if (index != 0) {
        newdiv.style.display = 'none'
    }

    var qset;
    if (type != 'titanic') {
        qset = questions[randnum]
    } else {
        qset = questions
    }

    // if(qset.length != 2){
    comsection = document.createElement('div')
    comsection.className = 'slimcontainer'
    // comsection2 = document.createElement('div')
    // comsection2.className = 'slimcontainer'
    tablediv = document.createElement('div')
    tablediv.style.float = 'left'

    // first row
    buf = '<table><tr><td style="width:30px;"></td>'
    for (i = 0; i < qset.length; i++) {
        buf += '<td style="text-align:center"><b style="color:' + clr[i] + '">Person ' + (i + 1) + '</th>'
    }
    buf += '</tr>'

    for (var feat in qset[0]) {
        if (feat.includes('survival')) { continue }
        buf += '<tr><th style="text-align:left"><a style="font-size:large;">' + icons[feat] + '</a>:' + explanation[feat] + '</th>'
        // buf += 
        for (var vv of qset) {
            buf += '<td style="width:160px;text-align:center">'
            if (vv[feat].includes('terminal')) {
                buf += 'terminally ill<br>(less than 3 years left)'
            } else {
                buf += vv[feat]
            }
            buf += '</td>'
        }
        buf += '</tr>'
    }
    buf += '</table>'

    // buf += '<p style="font-size:small">'
    // buf += icons['age'] + ': age,' + icons['health']+': health, ' + icons['gender'] 
    // buf += ': gender, ' + icons['income level'] + ': income level, '+ icons['number of dependents']+': number of dependents'
    // buf += '<br> For more information, hover your cursor above the icons in the table</p>'

    buf += '<h4>Please assign each option a score in the table below</h4><p><small>'
    buf += 'These scores are relative to each other and are meant to express the ranking between them.'
    buf += '</small><br><small>'
    buf += 'The more you think this option should be chosen, the higher the score should be.'
    buf += '</small><br><small>'
    buf += 'example: A score of A: 10, B: 8, C: 6 would mean you want to choose option A the most, then option B and finally option C.'
    buf += '</small></p>'

    tablediv.innerHTML = buf
    comsection.appendChild(tablediv)

    // makes bottom table part
    section = document.createElement('div')
    if (qset.length == 4) { section.className = 'bigcontainer' }
    else if (qset.length == 2) { section.className = 'notslimcon' }
    else { section.className = 'midcontainer' }

    // tbl = '<br>This table shows the survival chances of each person for each option<br>'
    // tbl = tbl + 'Each row shows the survival chances of the person when you choose that option<br>'
    // tbl = tbl + 'Please score each option on how much you prefer it<br><br>'
    // tbl = tbl + '<br><br>'
    tbl = '<table style="width:700px">'
    tbl += '<tr><td style="min-width:170px;border-bottom:0px white;"></td>'
    tbl += '<td colspan=' + qset.length.toString() + ' style="width:' + (qset.length * 80) + 'px ! important;text-align:center">Survival Chance</td>'
    tbl += '<td></td></tr>'
    tbl += '<tr><td style="border-top:0px white;"></td>'
    tbl += '<td style="width:80px;text-align:center"><b style="color:' + clr[0] + '">Person 1</b></td>'
    tbl += '<td style="width:80px;text-align:center"><b style="color:' + clr[1] + '">Person 2</b></td>'
    if (qset.length > 2) {
        tbl = tbl + '<td style="width:80px;text-align:center"><b style="color:' + clr[2] + '">Person 3</b></td>'
    }
    if (qset.length == 4) {
        tbl = tbl + '<td style="width:80px;text-align:center"><b style="color:' + clr[3] + '">Person 4</b></td>'
    }
    tbl = tbl + '<td style="width:200px;text-align:center"><b>Score</b></td></tr>'
    for (i = 0; i < qset.length; i++) {
        tbl = tbl + '<tr><th style="width:160px;">Option ' + ops[i] + ': give the jacket to <b style="color:' + clr[i] + '">Person ' + (i + 1).toString() + '</b></th>'
        tbl = tbl + '<td style="text-align:center"><a id="' + qq + 'optA' + i.toString() + '"></a></td>'
        tbl = tbl + '<td style="text-align:center"><a id="' + qq + 'optB' + i.toString() + '"></a></td>'
        if (qset.length > 2) {
            tbl = tbl + '<td style="text-align:center"><a id="' + qq + 'optC' + i.toString() + '"></a></td>'
        }
        if (qset.length == 4) {
            tbl = tbl + '<td style="text-align:center"><a id="' + qq + 'optD' + i.toString() + '"></a></td>'
        }
        tbl = tbl + '<td><crowd-slider name="' + qq + 'option' + ops[i] + '" id="' + qq + 'option' + ops[i] + '" style="float:left" min="0" max="10" required pin></crowd-slider></td>'
        tbl = tbl + '</tr>'
    }
    tbl = tbl + '</table>'
    section.innerHTML = tbl
    newdiv.appendChild(comsection)
    // if(type !='pair'){
    //   newdiv.appendChild(comsection2)}
    newdiv.appendChild(section)

    qtype = document.createElement('input')
    qtype.id = qq + 'type'
    qtype.name = qtype.id
    qtype.type = 'text'
    qtype.style.display = 'none'
    qtype.value = type

    qop_index = document.createElement('input')
    qop_index.id = qq + 'optionset'
    qop_index.name = qop_index.id
    qop_index.type = 'text'
    qop_index.style.display = 'none'
    qop_index.value = randnum.toString()

    newdiv.appendChild(qtype)
    newdiv.appendChild(qop_index)

    // adding stuff into DOM
    document.getElementById('realsurvey').insertBefore(newdiv, document.getElementById('q17'))

    for (i = 0; i < qset.length; i++) {
        // table = qset[i]['table']    
        // table = table.split('<tr><th style="border-right:0px white">survival with jacket')[0]
        // if(type == 'pair'){
        // document.getElementById(qq+'opt'+ops[i]+'with').innerHTML = qset[i].vals['survival with jacket']
        // document.getElementById(qq+'opt'+ops[i]+'without').innerHTML = qset[i].vals['survival without jacket']
        // } else {
        for (j = 0; j < qset.length; j++) {
            if (i == j) {
                document.getElementById(qq + 'opt' + ops[i] + j.toString()).innerHTML = qset[i]['survival with jacket']
            } else {
                document.getElementById(qq + 'opt' + ops[i] + j.toString()).innerHTML = qset[i]['survival without jacket']
            }
        }
        // }
        // document.getElementById(qq+'text'+ops[i]).innerHTML=table

    }
}