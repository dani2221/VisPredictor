import './App.css';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

function App() {

  const [inputs,setInputs] = useState([5,5,5,5,5,5,5,5]);
  const [validation,setValidation] = useState(false);
  const [openDialog,setOpenDialog] = useState(false);
  const [grade,setGrade] = useState(0);
  const { width, height } = useWindowSize()

  useEffect(()=>{
    axios.get('https://vispredictor.azurewebsites.net/').then(res=>console.log(res));
  },[])

  const changeInput = (input, index) =>{
    setInputs(ipts=>{
      const copy = [...ipts]
      if(parseInt(input.target.value) == 1){
        copy[index] = 10;
        return copy;
      }
      if(parseInt(input.target.value) > 10){
        setValidation("Оценката неможе да биде поголема од 10");
        copy[index] = 10;
        return copy;
      }
      else if(parseInt(input.target.value) < 5){
        setValidation("Оценката неможе да биде помала од 5");
        copy[index] = 5;
        return copy;
      }
      copy[index] = parseInt(input.target.value);
      return copy;
    })
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setValidation("");
  };
  const getGrade = () => {
    if(inputs.filter(x => isNaN(x)).length > 0){
      setValidation("Внесете ги сите полиња");
      return;
    }
    setOpenDialog(true);
    axios.post('https://vispredictor.azurewebsites.net/prediction',inputs).then(res=>{
      setGrade(Math.floor(parseFloat(res.data.prediction)))
    }).catch(err=>{
      console.log(err)
      setValidation("Се случи грешка");
    })
  }
  const handleCloseDialog = (event, reason) => {
    setOpenDialog(false);
    setGrade(0)
  };

  return (
    <div className="App">
      <div style={{margin:'30px'}}>
        <h2 style={{color:'white'}}>Дознај дали ќе положиш Веројатност и Статистика со помош на машинско учење!</h2>
        <br style={{marginTop:'20px'}}/>
        <h3 style={{color:'white'}}>Внеси претходни оценки</h3>
      </div>
      <div style={{marginTop:'50px'}}>
        <TextField required value={inputs[0]} onChange={ev=>changeInput(ev,0)} size={'small'} style={{margin:'7px'}} label="Вовед во компјутерски науки" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
        <TextField required value={inputs[1]} onChange={ev=>changeInput(ev,1)} size={'small'} style={{margin:'7px'}} label="Структурно програмирање" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
        <TextField required value={inputs[4]} onChange={ev=>changeInput(ev,4)} size={'small'} style={{margin:'7px'}} label="Објектно ориентирано програмирање" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
        <TextField required value={inputs[7]} onChange={ev=>changeInput(ev,7)} size={'small'} style={{margin:'7px'}} label="Алгоритми и податочни структури" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
        <TextField required value={inputs[6]} onChange={ev=>changeInput(ev,6)} size={'small'} style={{margin:'7px'}} label="Архитектура и организација на комјутери" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
        <TextField required value={inputs[3]} onChange={ev=>changeInput(ev,3)} size={'small'} style={{margin:'7px'}} label="Изборен предмет од 2 семестар" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
        <TextField required value={inputs[2]} onChange={ev=>changeInput(ev,2)} size={'small'} style={{margin:'7px'}} label="Дискретна математика" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
        <TextField required value={inputs[5]} onChange={ev=>changeInput(ev,5)} size={'small'} style={{margin:'7px'}} label="Калкулус" variant="outlined" type="number" InputLabelProps={{shrink: true}}/>
      </div>
      <div style={{margin:'30px'}}>
        <Alert severity="warning">Ако немаш слушано Калкулус внеси оценка која ќе биде аритметичка средина од Калкулус 1 и Калкулус 2</Alert>
        <Alert severity="warning">Ако немаш слушано Дискретна математика внеси оценка која ќе биде аритметичка средина од Дискретни структури 1 и Дискретни структури 2</Alert>
        <Alert severity="info">Изборен од 2 семестар (L1 предмет пример ОнВД, ОнСБ, М)</Alert>
      </div>
      <div>
        <Button variant="contained" size="large" onClick={getGrade}>Пресметај оценка</Button>
      </div>
      <hr style={{margin:'20px',marginTop:'45px'}}/>
      <p style={{color:'white',marginBottom:'10px'}}>Се работи за модел на длабоко учење истрениран на оценките на околу 250 претходни студенти. Прочитај повеќе и разгледај го кодот <a href='https://medium.com/@danilo.najkov/using-regression-techniques-to-predict-a-students-grade-for-a-course-a5042861a664'>тука.</a></p>
      <Snackbar open={validation.length>0} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {validation}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <div style={{padding:'10px',textAlign:'center'}}>
          <h2 style={{marginBottom:'40px'}}>Твојата оценка по ВИС е...</h2>
          {grade == 0 ? <CircularProgress /> : <div style={{fontSize:200}}>{grade}</div>}
          {grade != 0 && inputs.filter(x => x==10).length == inputs.length ? 'Сите имаме соништа. Ајде сега внеси ги твоите вистински оценки' : grade > 5 ? 'Браво! Ќе положиш :D' : grade == 5 ? 'Нема да положиш :(' :''}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Затвори</Button>
        </DialogActions>
      </Dialog>
      {grade > 5 ? <Confetti width={width} height={height}/> : grade == 5 ? '':''}
    </div>
  );
}

export default App;
