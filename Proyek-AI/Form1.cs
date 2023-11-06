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
        public Form1()
        {
            InitializeComponent();
        }

        public void printAwal(){
            // Console.WriteLine("Hello World");
            standP1.BackColor = Color.White;
            flatP1.BackColor = Color.White;
            standP2.BackColor = Color.Gray;
            flatP2.BackColor = Color.Gray;
        }

        public void printMap()
        {

            \
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
    }
}
