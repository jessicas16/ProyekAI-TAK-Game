using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Proyek_AI
{
    public partial class Form1 : Form
    {
        List<Button> map = new List<Button>();
        List<Button> stack = new List<Button>();
        int turn = 0;
        int detik = 0;

        public Form1()
        {
            InitializeComponent();
        }

        public void printAwal(){
            standP1.BackColor = Color.Salmon;
            standP1.FlatStyle = FlatStyle.Flat;
            standP1.FlatAppearance.BorderSize = 0;
            flatP1.BackColor = Color.Salmon;
            flatP1.FlatStyle = FlatStyle.Flat;
            flatP1.FlatAppearance.BorderSize = 0;
            standP2.BackColor = Color.LightBlue;
            standP2.FlatStyle = FlatStyle.Flat;
            standP2.FlatAppearance.BorderSize = 0;
            flatP2.BackColor = Color.LightBlue;
            flatP2.FlatStyle = FlatStyle.Flat;
            flatP2.FlatAppearance.BorderSize = 0;
            panelGame.Visible = true;
            printMap();
            turn = 1;
            cekTurn();
        }

        public void printMap()
        {
            for (int i = 0; i < 5; i++)
            {
                for (int j = 0; j < 5; j++)
                {
                    Button btn = new Button();
                    btn.Size = new Size(70, 70);
                    btn.Location = new Point(75 * j, 75 * i);
                    btn.BackColor = Color.White;
                    btn.FlatStyle = FlatStyle.Flat;
                    btn.FlatAppearance.BorderSize = 0;
                    btn.AllowDrop = true;
                    btn.Parent = this.panelGame;
                    btn.Click += new EventHandler(this.buttonPilih);
                    map.Add(btn);
                    panelGame.Controls.Add(btn);
                }
            }
        }

        public void printStack()
        {
            for (int i = 0; i < stack.Count; i++)
            {
                Button btn = new Button();
                btn.Size = new Size(10, 5);
                btn.Location = new Point(7 * i, 0);
                btn.BackColor = stack[i].BackColor;
                btn.FlatStyle = FlatStyle.Flat;
                btn.FlatAppearance.BorderSize = 0;
                btn.AllowDrop = true;
                //btn.Parent = this.panelStack;
                stack.Add(btn);
                panelStack.Controls.Add(btn);
            }
        }

        public void buttonPilih(object sender, EventArgs e)
        {
            Button b = (Button)sender;
            if (turn == 1)
            {
                if (b.BackColor != Color.White){
                    stack.Add(b);
                    printStack();
                }
                b.BackColor = Color.Salmon;
                turn = 2;
                cekTurn();
            }
            else if (turn == 2)
            {
                b.BackColor = Color.LightBlue;
                if (b.BackColor != Color.White){
                    stack.Add(b);
                    printStack();
                }
                turn = 1;
                cekTurn();
            }
        }

        public void cekTurn(){
            Console.WriteLine(turn);
            if (turn == 1){
                //player 1
                turnLabel.Text = "1";
                buttonTurn.BackColor = Color.Salmon;
            } else if (turn == 2){
                //player 2
                turnLabel.Text = "2";
                buttonTurn.BackColor = Color.LightBlue;
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            printAwal();
        }

        private void button3_Click(object sender, EventArgs e)
        {

        }

        private void standP1_DragOver(object sender, DragEventArgs e)
        {

        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void timer1_Tick(object sender, EventArgs e)
        {
           
        }
    }
}
