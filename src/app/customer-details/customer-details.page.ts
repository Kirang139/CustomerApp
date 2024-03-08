import { Component, OnInit } from '@angular/core';
import { GetMemberProfileService } from '../api/services/get-member-profile.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as CONSTANTS from '../api/services/Constants';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.page.html',
  styleUrls: ['./customer-details.page.scss'],
})
export class CustomerDetailsPage implements OnInit {
  promotionData: any;
  autopilotData: any;
  rewardData: any = [];
  showPromotionData: boolean = false;
  showAutopilotData: boolean = false;
  showRewardData: boolean = false;
  memberId: any;
  memberTableId: any;
  memberName: any;
  memberSince: any;
  memberCurrentPoints: any = 0;
  badgeColor: any;
  value1: any;
  countDown1: any;
  myInterval1: any;
  isLoading: boolean = false;
  isSpinWheelInteger: boolean = false;
  spinWheelText: any = '';
  BusinessGroupID: any = localStorage.getItem('businessGroupId');
  BusinessLocationID: any = localStorage.getItem('businessLocationId');
  SourceID: any = localStorage.getItem('sourceId');
  memberImage: any;
  constnt: any = CONSTANTS;

  constructor(private _memberProfile: GetMemberProfileService, private toastCtrl: ToastController, private router: Router) { }

  ionViewWillEnter() {
    this.isLoading = true;
    this.value1 = 30000;   
    this.countDown1 = 30; 
    let member: any = JSON.parse(localStorage.getItem("memberDetails") || '{}');
    this.memberId = member.memberId;
    this.memberTableId = member.memberTableID;
    this.memberName = member.name;
    this.memberSince = member.memberSince;
    this.memberImage = member.memberImg;
    this.memberCurrentPoints = (typeof (member.spinWheelPoint) == 'number' ? member.currentPoints + member.spinWheelPoint :
      member.currentPoints);
    this.badgeColor = member.badgeColor;
    
    if (typeof (member.spinWheelPoint) == 'number') {
      this.isSpinWheelInteger = true;
    } else if (member.spinWheelPoint != 'undefined' && member.spinWheelPoint != null && member.spinWheelPoint != '') {
      this.isSpinWheelInteger = false;
      this.spinWheelText = 'Hooray! You have won ' + member.spinWheelPoint;
    } else {
      this.isSpinWheelInteger = true;
    }

    this.GetPromotionsList();
    this.GetAutopilotList();
    this.GetRewardList();

    setTimeout(() => {
      this.isLoading = false;
      this.myInterval1 = setInterval(() => {
        this.counter();
      }, 1000);
    }, 200)
  }

  ngOnInit() { }

  counter() {
    this.value1 = this.value1 - 1000;
    this.countDown1 = this.countDown1 - 1;
    if (this.value1 === 0) {
      clearInterval(this.myInterval1);
      this.router.navigate(['tab1']);
    }
  }

  ionViewDidLeave() {
    // Do actions here
    clearInterval(this.myInterval1);
  }

  async GetPromotionsList() {
    await this._memberProfile.GetPromotionsByMemberId(this.BusinessLocationID, this.memberId).subscribe((data: any) => {
      this.promotionData = data;
      if (this.promotionData.length > 0) {
        this.showPromotionData = true;
        this.promotionData.forEach((element: any) => {
          element.stateChecked = false;
        });
      }
      else {
        this.showPromotionData = false;
      }
    },
      async (error) => {
        this.showPromotionData = false;
      }
    );
  }

  async GetAutopilotList() {
    await this._memberProfile.GetAutopilotByMemberId(this.BusinessGroupID, this.memberId).subscribe((data: any) => {
      this.autopilotData = data;
      if (this.autopilotData.length > 0) {
        this.showAutopilotData = true;
      }
      else {
        this.showAutopilotData = false;
      }
    },
      async (error) => {
        this.showAutopilotData = false;
      }
    );
  }

  async GetRewardList() {
    await this._memberProfile.GetRewardByMemberId(this.BusinessGroupID, this.memberId).subscribe((data: any) => {
      this.rewardData = data;
      if (this.rewardData) {
        this.showRewardData = true;
      }
    },
      async (error) => {
        if (error.status == 404) {
          this.showRewardData = false;
        } else {
          this.showRewardData = false;
        }
      }
    );
  }

  submit() {
    clearInterval(this.myInterval1);
    this.isLoading = false;
    this.router.navigate(['/Favorites']);
  }
}
