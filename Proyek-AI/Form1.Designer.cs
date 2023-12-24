
namespace Proyek_AI
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.label1 = new System.Windows.Forms.Label();
            this.flatP1 = new System.Windows.Forms.Button();
            this.flatP2 = new System.Windows.Forms.Button();
            this.standP1 = new System.Windows.Forms.Button();
            this.standP2 = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.panelGame = new System.Windows.Forms.Panel();
            this.turnLabel = new System.Windows.Forms.Label();
            this.buttonTurn = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.panelStack = new System.Windows.Forms.Panel();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(332, 28);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(124, 24);
            this.label1.TabIndex = 0;
            this.label1.Text = "Playing TAK";
            this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // flatP1
            // 
            this.flatP1.Location = new System.Drawing.Point(62, 172);
            this.flatP1.Name = "flatP1";
            this.flatP1.Size = new System.Drawing.Size(75, 67);
            this.flatP1.TabIndex = 1;
            this.flatP1.Text = "21";
            this.flatP1.UseVisualStyleBackColor = true;
            // 
            // flatP2
            // 
            this.flatP2.Location = new System.Drawing.Point(644, 172);
            this.flatP2.Name = "flatP2";
            this.flatP2.Size = new System.Drawing.Size(75, 67);
            this.flatP2.TabIndex = 2;
            this.flatP2.Text = "21";
            this.flatP2.UseVisualStyleBackColor = true;
            // 
            // standP1
            // 
            this.standP1.Location = new System.Drawing.Point(74, 272);
            this.standP1.Name = "standP1";
            this.standP1.Size = new System.Drawing.Size(51, 91);
            this.standP1.TabIndex = 3;
            this.standP1.Text = "1";
            this.standP1.UseVisualStyleBackColor = true;
            this.standP1.Click += new System.EventHandler(this.button3_Click);
            this.standP1.DragOver += new System.Windows.Forms.DragEventHandler(this.standP1_DragOver);
            // 
            // standP2
            // 
            this.standP2.Location = new System.Drawing.Point(656, 272);
            this.standP2.Name = "standP2";
            this.standP2.Size = new System.Drawing.Size(51, 91);
            this.standP2.TabIndex = 4;
            this.standP2.Text = "1";
            this.standP2.UseVisualStyleBackColor = true;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(308, 92);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(64, 20);
            this.label2.TabIndex = 5;
            this.label2.Text = "Player : ";
            // 
            // panelGame
            // 
            this.panelGame.Location = new System.Drawing.Point(197, 143);
            this.panelGame.Name = "panelGame";
            this.panelGame.Size = new System.Drawing.Size(382, 365);
            this.panelGame.TabIndex = 6;
            // 
            // turnLabel
            // 
            this.turnLabel.AutoSize = true;
            this.turnLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.turnLabel.Location = new System.Drawing.Point(368, 92);
            this.turnLabel.Name = "turnLabel";
            this.turnLabel.Size = new System.Drawing.Size(14, 20);
            this.turnLabel.TabIndex = 7;
            this.turnLabel.Text = "-";
            this.turnLabel.Click += new System.EventHandler(this.label3_Click);
            // 
            // buttonTurn
            // 
            this.buttonTurn.Location = new System.Drawing.Point(404, 70);
            this.buttonTurn.Name = "buttonTurn";
            this.buttonTurn.Size = new System.Drawing.Size(75, 67);
            this.buttonTurn.TabIndex = 8;
            this.buttonTurn.UseVisualStyleBackColor = true;
            // 
            // timer1
            // 
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // panelStack
            // 
            this.panelStack.Location = new System.Drawing.Point(126, 15);
            this.panelStack.Name = "panelStack";
            this.panelStack.Size = new System.Drawing.Size(63, 122);
            this.panelStack.TabIndex = 7;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(780, 625);
            this.Controls.Add(this.panelStack);
            this.Controls.Add(this.buttonTurn);
            this.Controls.Add(this.turnLabel);
            this.Controls.Add(this.panelGame);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.standP2);
            this.Controls.Add(this.standP1);
            this.Controls.Add(this.flatP2);
            this.Controls.Add(this.flatP1);
            this.Controls.Add(this.label1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button flatP1;
        private System.Windows.Forms.Button flatP2;
        private System.Windows.Forms.Button standP1;
        private System.Windows.Forms.Button standP2;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Panel panelGame;
        private System.Windows.Forms.Label turnLabel;
        private System.Windows.Forms.Button buttonTurn;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.Panel panelStack;
    }
}

