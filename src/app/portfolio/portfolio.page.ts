import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {

  constructor(public alertController: AlertController) {}

  ngOnInit() {
    this.showEmptyPortfolioAlert();
  }

    async showEmptyPortfolioAlert() {
      const alert = await this.alertController.create({
        header: 'Nothing here...',
        message: 'Looks like your portfolio is empty. Click the + symbol below to add something',
        buttons: [
          {text: 'OK'}
        ]
      });
      //need to check here if portfolio is empty before calling
      await alert.present();
      let result = await alert.onDidDismiss();
      console.log(result);
    }
}

