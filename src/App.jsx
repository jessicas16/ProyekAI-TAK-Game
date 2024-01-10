import { useState, useEffect } from 'react'
import global from './Global'
import { Clsboard } from './Clsboard'

function App() {
  var [sbe, setSBE] = useState([
    [1, 2, 3, 2, 1],
    [2, 4, 5, 4, 2],
    [3, 5, 6, 5, 3],
    [2, 4, 5, 4, 2],
    [1, 2, 3, 2, 1]
  ]);
  var [papan, setPapan] = useState(
    new Clsboard(global.BLACKTURN, [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
    ])
  );
  var [batu, setBatu] = useState("FLAT");
  var [giliran, setGiliran] = useState(global.BLACKTURN);
  var [jumMelangkah, setJumMelangkah] = useState(0);
  var [maxLevel, setMaxLevel] = useState(2);
  var [brsAngkat, setBrsAngkat] = useState(-1);
  var [klmAngkat, setKlmAngkat] = useState(-1);
  var [lastBrs, setLastBrs] = useState(-1);
  var [lastKlm, setLastKlm] = useState(-1);
  var [brsDirection, setBrsDirection] = useState(-1);
  var [klmDirection, setKlmDirection] = useState(-1);
  var [stackAngkat, setStackAngkat] = useState([]);
  var [sudah, setSudah] = useState(false);
  var [hitam, setHitam] = useState({
    flat: 0,
    wall: 0,
    cap: 0
  })
  var [putih, setPutih] = useState({
    flat: 0,
    wall: 0,
    cap: 0
  })

  useEffect(() => {
    runAI();
  }, [giliran]);

  function cekMenang(arr, gil, b, k) {
    // cek menang!
    var trace = [];
    trace = []; var flagKiri = nabrakTembok(arr, b, k, gil, trace, "KIRI");
    trace = []; var flagKanan = nabrakTembok(arr, b, k, gil, trace, "KANAN");
    trace = []; var flagAtas = nabrakTembok(arr, b, k, gil, trace, "ATAS");
    trace = []; var flagBawah = nabrakTembok(arr, b, k, gil, trace, "BAWAH");

    if (flagKiri == true && flagKanan == true) { 
      return true; 
    }
    else if (flagAtas == true && flagBawah == true) { 
      return true; 
    }
    return false; 
  }

  function findWeight(_papan) {
    var weight = 0;
    setSudah(false)
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        if (_papan.arr[i][j].length > 0) {
          // pngecekan kalau ai harus menang
          var top = _papan.arr[i][j].length - 1; 
          if(_papan.arr[i][j][top] == 21 || _papan.arr[i][j][top] == 23) {
            if(cekMenang(_papan.arr, global.WHITETURN, i, j) == true) { return 1000; }
          }

          if (!sudah){
            // pengecekan kalau harus ngeblok player spy tidak menang          
            _papan.arr[i][j].push(global.FLATSTONE_BLACK);
            var res = cekMenang(_papan.arr, global.BLACKTURN, i, j);
            _papan.arr[i][j].pop();
            if(res == true) { 
              setSudah(true)
              return 900;
            }  
          }


          var t = _papan.arr[i][j].length - 1;
          if (_papan.giliran == global.BLACKTURN) {
            if (_papan.arr[i][j][t] >= global.FLATSTONE_BLACK && _papan.arr[i][j][t] <= global.CAPSTONE_BLACK) {
              if (_papan.arr[i][j][t] == global.FLATSTONE_BLACK) {
                weight = weight + (sbe[i][j]) + 4;
              } else if (_papan.arr[i][j][t] == global.WALLSTONE_BLACK) {
                weight = weight + (sbe[i][j]) + 2;
              } else if (_papan.arr[i][j][t] == global.CAPSTONE_BLACK){
                weight = weight + (sbe[i][j]) + 10;
              } else  if (_papan.arr[i][j][t] == global.FLATSTONE_WHITE) {
                weight = weight + (sbe[i][j]) - 2;
              } else if (_papan.arr[i][j][t] == global.WALLSTONE_WHITE) {
                weight = weight + (sbe[i][j]) - 1;
              } else if (_papan.arr[i][j][t] == global.CAPSTONE_WHITE){
                weight = weight + (sbe[i][j]) - 5;
              }
            }
          }
          else {
            if (_papan.arr[i][j][t] >= global.FLATSTONE_WHITE && _papan.arr[i][j][t] <= global.CAPSTONE_WHITE) {
              if (_papan.arr[i][j][t] == global.FLATSTONE_BLACK) {
                weight = weight + (sbe[i][j]) - 2;
              } else if (_papan.arr[i][j][t] == global.WALLSTONE_BLACK) {
                weight = weight + (sbe[i][j]) - 1;
              } else if (_papan.arr[i][j][t] == global.CAPSTONE_BLACK){
                weight = weight + (sbe[i][j]) - 5;
              } else  if (_papan.arr[i][j][t] == global.FLATSTONE_WHITE) {
                weight = weight + (sbe[i][j]) + 4;
              } else if (_papan.arr[i][j][t] == global.WALLSTONE_WHITE) {
                weight = weight + (sbe[i][j]) + 2;
              } else if (_papan.arr[i][j][t] == global.CAPSTONE_WHITE){
                weight = weight + (sbe[i][j]) + 10;
              }
            }
          }
        }
      }
    }
    return weight;
  }

  function copyArray(src) {
    var _arr = [];
    for (var b = 0; b < 5; b++) {
      var temparr = [];
      for (var k = 0; k < 5; k++) {

        var item = [];
        for (var t = 0; t < src[b][k].length; t++) {
          item.push(src[b][k][t]);
        }

        temparr.push(item);
      }
      _arr.push(temparr);
    }
    return _arr;
  }

  function isRightPath(arr, brs, klm, gil) {
    if (arr[brs][klm].length == 0) { return false; }
    else {
      if (gil == global.BLACKTURN) {
        if (arr[brs][klm][arr[brs][klm].length - 1] == global.FLATSTONE_BLACK || arr[brs][klm][arr[brs][klm].length - 1] == global.CAPSTONE_BLACK) { return true; }
      }
      else {
        if (arr[brs][klm][arr[brs][klm].length - 1] == global.FLATSTONE_WHITE || arr[brs][klm][arr[brs][klm].length - 1] == global.CAPSTONE_WHITE) { return true; }
      }
      return false;
    }
  }

  function nabrakTembok(arr, brs, klm, warna, trace, sisi) {
    if (sisi == "KIRI" && klm == 0 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if (sisi == "KANAN" && klm == 4 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if (sisi == "ATAS" && brs == 0 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else if (sisi == "BAWAH" && brs == 4 && isRightPath(arr, brs, klm, warna) == true) { return true; }
    else {
      var filter = trace.filter(item => item.brs == brs && item.klm == klm);
      if (filter.length == 0) {
        var valid = false;
        if (arr[brs][klm].length > 0) {
          if (isRightPath(arr, brs, klm, warna) == true) { valid = true; }
        }

        if (valid == true) {
          trace.push({ brs: brs, klm: klm });
          var flag = false;
          var dx = [0, 0, 1, -1];
          var dy = [1, -1, 0, 0];
          for (var i = 0; i < 4 && flag == false; i++) {
            if (brs + dy[i] >= 0 && brs + dy[i] < 5 && klm + dx[i] >= 0 && klm + dx[i] < 5) {
              flag = nabrakTembok(arr, brs + dy[i], klm + dx[i], warna, trace, sisi);
              if (flag == false) {
                trace.slice(trace.length - 1, 1);
              }
            }
          }
          return flag;
        }
        else { return false; }
      }
      else { return false; }
    }
  }

  function minimum(_level, _giliran, _papan, _result) {
    console.log("minimum Level = " + _level);
    if (_level > maxLevel) {
      console.log("weight" + findWeight(_papan))
      return findWeight(_papan);
    }
    else {
      var status = [];
      status['maxweight'] = 0;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      if (jumMelangkah >= 2) {

      }
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong
          {
            if (jumMelangkah < 2) { 
              //harus flat
              var _arr = copyArray(_papan.arr);
              var koin = "";
              var _notgiliran = _giliran;
              if (_giliran == global.BLACKTURN) {
                _notgiliran = global.WHITETURN;
                koin = global.FLATSTONE_BLACK;
                _arr[i][j].push(global.FLATSTONE_BLACK);
              }
              else {
                _notgiliran = global.BLACKTURN;
                koin = global.FLATSTONE_WHITE;
                _arr[i][j].push(global.FLATSTONE_WHITE);
              }   
              
              var weight = maksimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
              console.log("weight = " + weight)
              console.log(status['maxweight'])
              if (weight < status['maxweight']) {
                status['maxweight'] = weight;
                status['bar'] = i;
                status['kol'] = j;
                status['koin'] = koin;
              }
            }
            else  // jumMelangkah < 2 adlah @ player melangkah pertama kali (harus flat_stone)
            {
              var _arr = copyArray(_papan.arr);
              var koin = "";
              var _notgiliran = _giliran;
              if (_giliran == global.BLACKTURN) {
                _notgiliran = global.WHITETURN;
                koin = global.FLATSTONE_WHITE;
                _arr[i][j].push(global.FLATSTONE_WHITE);
              }
              else {
                _notgiliran = global.BLACKTURN;
                koin = global.FLATSTONE_BLACK;
                _arr[i][j].push(global.FLATSTONE_BLACK);
              }

              var weight = maksimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
              if (weight < status['maxweight']) {
                status['maxweight'] = weight;
                status['bar'] = i;
                status['kol'] = j;
                status['koin'] = koin;
              }
            }
          }
        }
      }

      _result['maxweight'] = status['maxweight'];
      _result['bar'] = status['bar'];
      _result['kol'] = status['kol'];
      _result['koin'] = status['koin'];
    }
  }

  function maksimum(_level, _giliran, _papan, _result) {
    console.log("Maksimum", _level)
    if (_level <= maxLevel) {
      var status = [];
      status['maxweight'] = 0;
      status['bar'] = -1;
      status['kol'] = -1;
      status['koin'] = -1;

      // probabilitas a
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (_papan.arr[i][j].length == 0)     // jika kotak tsb kondisi kosong 
          {
            // berikan pengecekan apakah flatstone+wallstone masih tersedia < 21 
            var aw = 0; var ak = 0; 
            if(_giliran == global.BLACKTURN) 
            { 
              if(jumMelangkah < 2) //first time
              { 
                aw = global.FLATSTONE_BLACK;
                ak = global.FLATSTONE_BLACK; 
              } 
              else 
              { 
                aw = global.FLATSTONE_BLACK; 
                ak = global.CAPSTONE_BLACK; 
                if(hitam.cap > 0) {
                  ak = global.WALLSTONE_BLACK; 
                }
              }
            }
            else { 
              if(jumMelangkah < 2)
              { 
                aw = global.FLATSTONE_WHITE; 
                ak = global.FLATSTONE_WHITE; 
              } 
              else 
              { 
                aw = global.FLATSTONE_WHITE; 
                ak = global.CAPSTONE_WHITE; 
                if(putih.cap > 0 && putih.cap < 2) { 
                  ak = global.WALLSTONE_WHITE; 
                }
              }
            }

            for(var koinjalan = aw; koinjalan <= ak; koinjalan++) {
              var _arr = copyArray(_papan.arr);
              var koin = "";
              var _notgiliran = _giliran;
              if (_giliran == global.BLACKTURN) {
                _notgiliran = global.WHITETURN;
                koin = koinjalan;
                _arr[i][j].push(koinjalan);
              }
              else {
                _notgiliran = global.BLACKTURN;
                // console.log("koinjalan = " + koinjalan)
                koin = koinjalan;
                if (koinjalan == global.CAPSTONE_WHITE) {
                  if (putih.cap === 0) {
                    setPutih({
                      flat: putih.flat,
                      wall: putih.wall, 
                      cap: putih.cap + 1
                    })
                  } 
                } 
                if (koinjalan == global.WALLSTONE_WHITE){
                  if (putih.wall + putih.flat < 21) {
                    _arr[i][j].push(koinjalan);
                    setPutih({
                      flat: putih.flat,
                      wall: putih.wall + 1, 
                      cap: putih.cap
                    })
                  } 
                } 
                if (koinjalan == global.FLATSTONE_WHITE) {
                  if (putih.wall + putih.flat < 21) {
                    _arr[i][j].push(koinjalan);
                    setPutih({
                      flat: putih.flat + 1,
                      wall: putih.wall, 
                      cap: putih.cap
                    })
                  }
                }
              }

              var weight = minimum(_level + 1, _notgiliran, new Clsboard(_giliran, _arr), _result);
              console.log(status["maxweight"])
              if (weight > status['maxweight']) {
                status['maxweight'] = weight;
                status['bar'] = i;
                status['kol'] = j;
                status['koin'] = koin;
              }
            }
          }
        }
      }

      _result['maxweight'] = status['maxweight'];
      _result['bar'] = status['bar'];
      _result['kol'] = status['kol'];
      _result['koin'] = status['koin'];
    }
  }

  function pertama(brs, klm){
    // pertama kali AI
    if (jumMelangkah == 0) {
      var level = 1
      var result = [];
      result['maxweight'] = 0;
      result['bar'] = -1;
      result['kol'] = -1;
      result['koin'] = -1;
      maksimum(level, giliran, papan, result);
      papan.arr[result['bar']][result['kol']].push(global.FLATSTONE_BLACK);
      setHitam({
        flat: hitam.flat + 1,
        wall: hitam.wall, 
        cap: hitam.cap
      })

      if (papan.arr[brs][klm].length == 0) {
        papan.arr[brs][klm].push(global.FLATSTONE_WHITE);
        setPutih({
          flat: putih.flat + 1,
          wall: putih.wall, 
          cap: putih.cap
        })
        setJumMelangkah(1);
      } else {
        console.log("salah")
      }
    }
  }

  function runAI() {
    if (giliran == global.WHITETURN){
      var level = 1
      var result = [];
      result['maxweight'] = 0;
      result['bar'] = -1;
      result['kol'] = -1;
      result['koin'] = -1;
      maksimum(level, giliran, papan, result);
      console.log("result = " + result['maxweight'] + " --- " + result['bar'] + " ---- " + result['kol']);
      console.log(result['koin'])

      if (papan.arr[result['bar']][result['kol']].length == 0 && brsAngkat == -1) {
        // titik itu kosong
        if(papan.arr[result['bar']][result['kol']].length == 5) { 
          return; 
        }
        else {
          if(result['koin'] == global.FLATSTONE_WHITE){
              papan.arr[result['bar']][result['kol']].push(global.FLATSTONE_WHITE);
              setPutih({
                flat: putih.flat + 1,
                wall: putih.wall, 
                cap: putih.cap
              })
          } else if (result['koin'] == global.WALLSTONE_WHITE){
              papan.arr[result['bar']][result['kol']].push(global.WALLSTONE_WHITE);
              setPutih({
                flat: putih.flat,
                wall: putih.wall + 1, 
                cap: putih.cap
              })
          } else {
              papan.arr[result['bar']][result['kol']].push(global.CAPSTONE_WHITE);
              setPutih({
                flat: putih.flat,
                wall: putih.wall, 
                cap: putih.cap + 1
              })
          }
          setJumMelangkah(jumMelangkah + 1);
        }
      } else {
        if (brsAngkat == -1){
          // angkat stack
          if (papan.arr[result['bar']][result['kol']].length > 0) {
            var top = papan.arr[result['bar']][result['kol']].length - 1;
            var topstack = papan.arr[result['bar']][result['kol']][top];
            if (topstack == global.FLATSTONE_WHITE || topstack == global.CAPSTONE_WHITE) {
              setBrsAngkat(result['bar']); 
              setKlmAngkat(result['kol']); 
              setBrsDirection(-1); 
              setKlmDirection(-1); 
              setStackAngkat(papan.arr[result['bar']][result['kol']]);
              papan.arr[result['bar']][result['kol']] = []; 
            }
          }
        } else {
          // naruh stack
          if(validTaruh(result['bar'], result['kol'], giliran) == true) {
            var getLast = papan.arr[result['bar']][result['kol']][papan.arr[result['bar']][result['kol']].length-1];
            if(getLast == global.CAPSTONE_BLACK || getLast == global.CAPSTONE_WHITE){
              alert("Stone apapun tidak bisa ditaruh di atas Capstone")
              return;
            } else if (getLast == global.WALLSTONE_BLACK || getLast == global.WALLSTONE_WHITE){
              if(stackAngkat[0] == global.CAPSTONE_BLACK || stackAngkat[0] == global.CAPSTONE_WHITE){
                // alert("Stone berubahhhh :D")
                console.log("stone berubah")
                if (getLast == global.WALLSTONE_BLACK){
                  papan.arr[result['bar']][result['kol']][papan.arr[result['bar']][result['kol']].length-1] = global.FLATSTONE_BLACK;
                } else {
                  papan.arr[result['bar']][result['kol']][papan.arr[result['bar']][result['kol']].length-1] = global.FLATSTONE_WHITE;
                }
              } else {
                alert("Stone apapun tidak bisa ditaruh di atas Wallstone selain Capstone")
                return;
              }
            }
            papan.arr[result['bar']][result['kol']].push(stackAngkat[0]);
            setStackAngkat(stackAngkat.filter((item, index) => index != 0));
            if(stackAngkat.length == 1) {
              setBrsAngkat(-1); 
              setKlmAngkat(-1); 
              setBrsDirection(-1); 
              setKlmDirection(-1); 
              setLastBrs(-1); 
              setLastKlm(-1); 
              setJumMelangkah(jumMelangkah + 1);
              gantiGiliran();
            }
          }
        }
      }


      // cek menang!
      var trace = [];
      trace = []; var flagKiri = nabrakTembok(papan.arr, result['bar'], result['kol'], giliran, trace, "KIRI");
      trace = []; var flagKanan = nabrakTembok(papan.arr, result['bar'], result['kol'], giliran, trace, "KANAN");
      trace = []; var flagAtas = nabrakTembok(papan.arr, result['bar'], result['kol'], giliran, trace, "ATAS");
      trace = []; var flagBawah = nabrakTembok(papan.arr, result['bar'], result['kol'], giliran, trace, "BAWAH");

      if (flagKiri == true && flagKanan == true) { 
        alert('horizontal win'); 
        if(giliran == 1){
          alert('BLACKTURN WIN!'); 
          return;
        } else {
          alert('WHITETURN WIN!'); 
          return;
        }
      }
      else if (flagAtas == true && flagBawah == true) { 
        alert('vertical win'); 
        if(giliran == 1){
          alert('BLACKTURN WIN!'); 
          return;
        } else {
          alert('WHITETURN WIN!'); 
          return;
        }
      }
      setGiliran(global.BLACKTURN); 
    } 
  }

  function gantiGiliran() {
    if (giliran == global.BLACKTURN) { 
      setGiliran(global.WHITETURN); 
    }
    else { 
      setGiliran(global.BLACKTURN); 
    }
  }

  function validTaruh(parambrs, paramklm, giliran) {
    if(brsDirection == -1 && klmDirection == -1) {
      // naruh stack pertama kali
      if(parambrs == brsAngkat && paramklm == klmAngkat) { return true; }
      else {
        var selisihbrs = Math.abs(parambrs - brsAngkat);
        var selisihklm = Math.abs(paramklm - klmAngkat); 
        if((selisihbrs == 0 && selisihklm == 1) || (selisihbrs == 1 && selisihklm == 0)) 
        { return true; }
      }
    }
    else { 
      if(parambrs - lastBrs == brsDirection && paramklm - lastKlm == klmDirection)
      { return true; }
      else if(parambrs == lastBrs && paramklm == lastKlm) 
      { return true; }
    }

    return false;
  }

  function bukadiv(brs, klm, stone) {
    if (papan.arr[brs][klm].length == 0 && brsAngkat == -1) {      // jika kotak kosong
      if (giliran == global.BLACKTURN) {
        if(papan.arr[brs][klm].length == 5) { 
          return; 
        }
        else {
          let last = papan.arr[brs][klm][papan.arr[brs][klm].length-1];
          if(stone == "FLAT"){
            if(hitam.wall + hitam.flat >= 21){
              alert("Black Stone habis!")
              return; 
            } else {
              if (last == global.CAPSTONE_BLACK || last == global.CAPSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Capstone")
                return;
              } else if (last == global.WALLSTONE_BLACK || last == global.WALLSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Wallstone")
                return;
              }
              papan.arr[brs][klm].push(global.FLATSTONE_BLACK);
              setHitam({
                flat: hitam.flat + 1,
                wall: hitam.wall, 
                cap: hitam.cap
              })
            }
          } else if (stone == "WALL"){
            if(hitam.wall + hitam.flat >= 21){
              alert("Black Stone habis!")
              return; 
            } else {
              if (last == global.CAPSTONE_BLACK || last == global.CAPSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Capstone")
                return;
              } else if (last == global.WALLSTONE_BLACK || last == global.WALLSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Wallstone")
                return;
              }
              papan.arr[brs][klm].push(global.WALLSTONE_BLACK);
              setHitam({
                flat: hitam.flat,
                wall: hitam.wall + 1, 
                cap: hitam.cap
              })
            }
          } else {
            if(hitam.cap == 1){
              alert("Black Cap Stone habis!")
              return; 
            } else {
              if (last == global.CAPSTONE_BLACK || last == global.CAPSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Capstone")
                return;
              } else if (last == global.WALLSTONE_BLACK || last == global.WALLSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Wallstone")
                return;
              }
              papan.arr[brs][klm].push(global.CAPSTONE_BLACK);
              setHitam({
                flat: hitam.flat,
                wall: hitam.wall, 
                cap: hitam.cap + 1
              })
            }
          }
        }
      }
      else {
        if(papan.arr[brs][klm].length == 5) { 
          return; 
        }
        else {
          let last = papan.arr[brs][klm][papan.arr[brs][klm].length-1];
          if(stone == "FLAT"){
            if(putih.wall + putih.flat >= 21){
              alert("White Stone habis!")
              return; 
            } else {
              if (last == global.CAPSTONE_BLACK || last == global.CAPSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Capstone")
                return;
              } else if (last == global.WALLSTONE_BLACK || last == global.WALLSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Wallstone")
                return;
              }
              papan.arr[brs][klm].push(global.FLATSTONE_WHITE);
              setPutih({
                flat: putih.flat + 1,
                wall: putih.wall, 
                cap: putih.cap
              })
            }
          } else if (stone == "WALL"){
            if(putih.wall + putih.flat >= 21){
              alert("White Stone habis!")
              return; 
            } else {
              if (last == global.CAPSTONE_BLACK || last == global.CAPSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Capstone")
                return;
              } else if (last == global.WALLSTONE_BLACK || last == global.WALLSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Wallstone")
                return;
              }
              papan.arr[brs][klm].push(global.WALLSTONE_WHITE);
              setPutih({
                flat: putih.flat,
                wall: putih.wall + 1, 
                cap: putih.cap
              })
            }
          } else {
            if(putih.cap == 1){
              alert("White Cap Stone habis!")
              return; 
            } else {
              if (last == global.CAPSTONE_BLACK || last == global.CAPSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Capstone")
                return;
              } else if (last == global.WALLSTONE_BLACK || last == global.WALLSTONE_WHITE){
                alert("Stone apapun tidak bisa ditaruh di atas Wallstone")
                return;
              }
              papan.arr[brs][klm].push(global.CAPSTONE_WHITE);
              setPutih({
                flat: putih.flat,
                wall: putih.wall, 
                cap: putih.cap + 1
              })
            }
            
          }
        }
      }

      // cek menang 
      var trace = [];
      trace = []; var flagKiri = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KIRI");
      trace = []; var flagKanan = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KANAN");
      trace = []; var flagAtas = nabrakTembok(papan.arr, brs, klm, giliran, trace, "ATAS");
      trace = []; var flagBawah = nabrakTembok(papan.arr, brs, klm, giliran, trace, "BAWAH");

      if (flagKiri == true && flagKanan == true) { 
        alert('horizontal win'); 
        if(giliran == 1){
          alert('BLACKTURN WIN!'); 
          return;
        } else {
          alert('WHITETURN WIN!'); 
          return;
        }
      }
      else if (flagAtas == true && flagBawah == true) { 
        alert('vertical win'); 
        if(giliran == 1){
          alert('BLACKTURN WIN!'); 
          return;
        } else {
          alert('WHITETURN WIN!'); 
          return;
        }
      }
      setJumMelangkah(jumMelangkah + 1);
      gantiGiliran();
    }
    else {                          // jika kotak tidak kosong
      if(brsAngkat == -1) {
        var top = papan.arr[brs][klm].length - 1;
        var topstack = papan.arr[brs][klm][top];
        // angkat stack
        if (giliran == global.BLACKTURN && (topstack == global.FLATSTONE_BLACK || topstack == global.CAPSTONE_BLACK)) {
            setBrsAngkat(brs); setKlmAngkat(klm); 
            setBrsDirection(-1); 
            setKlmDirection(-1); 
            setStackAngkat(papan.arr[brs][klm]);
            papan.arr[brs][klm] = []; 
        }
        else if (giliran == global.WHITETURN && (topstack == global.FLATSTONE_WHITE || topstack == global.CAPSTONE_WHITE)) {
          setBrsAngkat(brs); 
          setKlmAngkat(klm); 
          setBrsDirection(-1); 
          setKlmDirection(-1); 
          setStackAngkat(papan.arr[brs][klm]);
          papan.arr[brs][klm] = []; 
        };  
      }
      else {
        // naruh stack
        if(validTaruh(brs, klm) == true) {
          var getLast = papan.arr[brs][klm][papan.arr[brs][klm].length-1];
          if(getLast == global.CAPSTONE_BLACK || getLast == global.CAPSTONE_WHITE){
            alert("Stone apapun tidak bisa ditaruh di atas Capstone")
            return;
          } else if (getLast == global.WALLSTONE_BLACK || getLast == global.WALLSTONE_WHITE){
            if(stackAngkat[0] == global.CAPSTONE_BLACK || stackAngkat[0] == global.CAPSTONE_WHITE){
              // alert("Stone berubahhhh :D")
              console.log("stone berubah")
              if (getLast == global.WALLSTONE_BLACK){
                papan.arr[brs][klm][papan.arr[brs][klm].length-1] = global.FLATSTONE_BLACK;
              } else {
                papan.arr[brs][klm][papan.arr[brs][klm].length-1] = global.FLATSTONE_WHITE;
              }
            } else {
              alert("Stone apapun tidak bisa ditaruh di atas Wallstone selain Capstone")
              return;
            }
          }
          papan.arr[brs][klm].push(stackAngkat[0]);
          setStackAngkat(stackAngkat.filter((item, index) => index != 0));
          if(stackAngkat.length == 1) {
            setBrsAngkat(-1); 
            setKlmAngkat(-1); 
            setBrsDirection(-1); 
            setKlmDirection(-1); 
            setLastBrs(-1); 
            setLastKlm(-1); 
            gantiGiliran(); 
          }
          else {
            if(brsDirection == -1 && klmDirection == -1) {
              if(!(brs == brsAngkat && klm == klmAngkat)) {
                setBrsDirection(brs - brsAngkat); 
                setKlmDirection(klm - klmAngkat);  
                setLastBrs(brs); 
                setLastKlm(klm);                
              }
              else {
                setLastBrs(brs); 
                setLastKlm(klm);                
              }  
            }
            else {
              setLastBrs(brs);
              setLastKlm(klm);
            }
          }

            // cek menang 
            var trace = [];
            trace = []; var flagKiri = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KIRI");
            trace = []; var flagKanan = nabrakTembok(papan.arr, brs, klm, giliran, trace, "KANAN");
            trace = []; var flagAtas = nabrakTembok(papan.arr, brs, klm, giliran, trace, "ATAS");
            trace = []; var flagBawah = nabrakTembok(papan.arr, brs, klm, giliran, trace, "BAWAH");

            if (flagKiri == true && flagKanan == true) { 
              alert('horizontal win'); 
              if(giliran == 1){
                alert('BLACKTURN WIN!'); 
                return;
              } else {
                alert('WHITETURN WIN!'); 
                return;
              }
            }
            else if (flagAtas == true && flagBawah == true) { 
              alert('vertical win'); 
              if(giliran == 1){
                alert('BLACKTURN WIN!'); 
                return;
              } else {
                alert('WHITETURN WIN!'); 
                return;
              }
            }
        }
        else {
          console.log('wrong');
        }
      }
    }
  }

  function sideBar() {
    return <div className='card border border-black' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#7BD3EA', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key='sidebar'>
      <table style={{ width: '100%' }}>
        {stackAngkat.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>  
                  {revnode == global.FLATSTONE_BLACK && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}></div>}
                  {revnode == global.FLATSTONE_WHITE && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_BLACK && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_WHITE && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'red', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_BLACK && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_WHITE && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'white', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                </td>
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  function Kotak1(indexbar, indexkol, node) {
    return <div onClick={() => bukadiv(indexbar, indexkol)} className='card border border-black' style={{ width: '100px', height: '80px', borderRadius: '2px', backgroundColor: '#7BD3EA', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key={indexbar + indexkol}>
      <table style={{ width: '100%' }}>
        {node.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>  
                  {revnode == global.FLATSTONE_BLACK && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}></div>}
                  {revnode == global.FLATSTONE_WHITE && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_BLACK && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_WHITE && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'red', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_BLACK && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_WHITE && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'white', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                </td>
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  function Kotak2(indexbar, indexkol, node) {
    return <div onClick={() => 
      {
        if (jumMelangkah == 0) {
          pertama(indexbar, indexkol)
        } else {
          bukadiv(indexbar, indexkol, batu)
        }
      }
    } className="card bg-indigo-300 border border-black" style={{ width: '100px', height: '80px', borderRadius: '2px', boxSizing: 'border-box', padding: '1px', margin: '1px' }} key={indexbar + indexkol}>
      <table style={{ width: '100%' }}>
        {node.slice().reverse().map((revnode, indexitem) => (
          <>
            {
              <tr style={{ width: '100%' }}>
                <td style={{ width: '100%' }}>  
                  {revnode == global.FLATSTONE_BLACK && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}></div>}
                  {revnode == global.FLATSTONE_WHITE && <div style={{ width: '100%', height: '10px', color: 'white', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_BLACK && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'white', backgroundColor: 'black', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.WALLSTONE_WHITE && <div style={{ width: '10%', marginLeft: '45%', height: '30px', color: 'red', backgroundColor: 'white', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_BLACK && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'black', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                  {revnode == global.CAPSTONE_WHITE && <div style={{ width: '20%', marginLeft: '40%', height: '20px', color: 'red', backgroundColor: 'white', borderRadius: '10px', border: '0px solid black', padding: '0px', fontWeight: 'bold', fontSize: '12px' }}> </div>}
                </td>
              </tr>
            }
          </>
        ))}
      </table>
    </div>
  }

  function reset(){
    setPapan(
      new Clsboard(global.BLACKTURN, [
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
      ])
    );
    setBatu("FLAT");
    setGiliran(global.BLACKTURN);
    setJumMelangkah(0);
    setMaxLevel(1);
    setBrsAngkat(-1);
    setKlmAngkat(-1);
    setLastBrs(-1);
    setLastKlm(-1);
    setBrsDirection(-1);
    setKlmDirection(-1);
    setStackAngkat([]);
    setHitam({
      flat: 0,
      wall: 0,
      cap: 0
    })
    setPutih({
      flat: 0,
      wall: 0,
      cap: 0
    })
  }

  return (
    <>
    <div className='w-screen h-screen bg-orange-200 flex flex-col justify-center items-center'>  
      <h4 className='text-4xl font-semibold my-4'>Play TAK</h4>
      <div className='flex flex-row text-lg font-semibold'>
        <h5 style={{marginRight:"50px", marginTop:"auto", marginBottom:"auto"}}>Giliran : { giliran }</h5>
        <div style={giliran == "1" ? {backgroundColor:"black", height:"40px", width:"80px"} : {backgroundColor:"white", height:"40px", width:"80px"}}></div>
      </div><br />
      <div className='flex flex-row'>
        <p className='font-semibold'>Pilih Batu : </p>
        <div>
          <input type="radio" className='ms-5' name="stone" id="" value={"Flat"} 
          onClick={()=>{
            setBatu("FLAT");
          }}/> Flat Stone
        </div>
        <div>
          <input type="radio" className='ms-5' name="stone" id="" value={"Wall"} 
          onClick={()=>{
            setBatu("WALL");
          }}/> Wall Stone
        </div>
        <div>
          <input type="radio" className='ms-5' name="stone" id="" value={"Cap"} onClick={()=>{
            setBatu("CAP");
          }}/> Cap Stone
        </div>
      </div> <br />
      {/* <button className='bg-blue-300 py-2 px-5 rounded-xl font-semibold text-lg' onClick={() => runAI() }>Run AI</button><br /> */}
      <button className='bg-blue-300 py-2 px-5 rounded-xl font-semibold text-lg' onClick={() => reset() }>Reset</button><br />
      <table border='0'>
        <tr>
          <td valign='top'>{sideBar()}</td>
          <td>
            <table border='1'>
              {
                papan.arr.map((item, indexbar) => (
                  <tr>
                    {
                      item.map((node, indexkol) => (
                        <td>
                          {(indexbar == brsAngkat && indexkol == klmAngkat) ? Kotak1(indexbar, indexkol, node) : Kotak2(indexbar, indexkol, node)}
                        </td>
                      ))
                    }
                  </tr>
                ))}
            </table>
          </td>
        </tr>
      </table>
    </div>
    </>
  )
}

export default App