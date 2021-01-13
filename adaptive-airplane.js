window.onload = chooseOptions

var api_address = 'http://127.0.0.1:8000/api/'
var cur_index = 0
var userkey = get_randomkey()
userkey = 'TESTING'
maxlen = 18

function chooseOptions() {
    // console.log(counters)
    document.getElementById("gender").selectedIndex = 0
    document.getElementById("education").selectedIndex = 0
    document.getElementById("agegroup").selectedIndex = 0
    document.getElementById('scenario_index').innerHTML = '1/' + (maxlen)
}

function next() {
    // index = 
    cur_index += 1
    if (cur_index < 17) {
        $('.question').hide()
        makeq(cur_index)
        document.getElementById('q')
    } else if (cur_index == 17) {
        $('.question').hide()
        $('#q17').show()
    } else {
        document.getElementById('nextbtn').disabled = true
    }
    $('#scenario_index').html('1/' + cur_index)
}

function accept() {
    document.getElementById("consentform").style.display = 'none'
    document.getElementById('survey').style.display = 'block'
}

function goback() {
    window.history.back()
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

    // first send request to server to set things up

    data = {
        unique_id: 'test_uni',
        survey_type: 'pair',
        last_response: last_response,
    }

    ready = false
    fetch(api_address+'setup', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(r => r.json()).then(r => {
        ready = true
    })

    make_titanic()
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

function makeq(index) {

    scores = []
    for (slider of $('#q' + (index - 1)).find('crowd-slider').toArray()) {
        scores.push(slider.value)
    }
    last_response = {
        scenario: window.last_scenario,
        response: scores
    }

    data = {
        unique_id: 'test_uni',
        survey_type: 'pair',
        last_response: last_response,
    }
    // call the api to grab a new question

    fetch(api_address+'survey', {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(r => r.json()).then(r => fill_data(r, index))
}

function make_titanic() {
    var titanic_story = [{ "age": "21", "health": "in great health", "gender": "male", "income level": "low", "number of dependents": "0", "survival without jacket": "0%", "survival with jacket": "32%" }, { "age": "32", "health": "in great health", "gender": "male", "income level": "low", "number of dependents": "0", "survival without jacket": "0%", "survival with jacket": "32%" }, { "age": "52", "health": "in great health", "gender": "female", "income level": "high", "number of dependents": "1", "survival without jacket": "0%", "survival with jacket": "32%" }, { "age": "5", "health": "in great health", "gender": "female", "income level": "high", "number of dependents": "0", "survival without jacket": "0%", "survival with jacket": "32%" }]
    fill_data(titanic_story, 0)
}

function fill_data(qset, index) {
    console.log(qset)
    explanation = {
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

    newdiv = document.createElement('div')
    qq = 'q' + index.toString()
    newdiv.id = qq
    newdiv.className = 'question'

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

    newdiv.appendChild(section)

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