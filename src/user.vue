<template>
    <div id="app" class="container py-3">
        <div
            class="modal fade"
            id="buy-service-dialog"
            tabindex="-1"
            role="dialog"
            aria-labelledby="buy-service-dialog-header"
            aria-hidden="true"
        >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5
                            class="modal-title"
                            id="buy-service-dialog-header"
                        >Buy {{selectedServiceProvider?selectedServiceProvider.name:''}}</h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            ref="buyCloseButton"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <template v-if="!showBuySuccess">
                            <div>{{selectedServiceProvider?selectedServiceProvider.detail:''}}</div>
                            <div class="form-group mt-3">
                                <label for="buy-amout-input">How much do you want to buy?</label>
                                <input
                                    class="form-control"
                                    type="number"
                                    v-model="buyAmount"
                                    min="1"
                                    step="1"
                                    id="buy-amout-input"
                                    :class="{'is-invalid':buyAmountInvalid||notEnough}"
                                    @keyup.enter="buy"
                                />
                                <div
                                    class="invalid-feedback"
                                    v-show="notEnough"
                                >Insufficient balance or transaction failure.</div>
                            </div>
                            <div class="form-group">
                                <label
                                    for="buy-private-key"
                                >Your private key for unlocking Ethereum account</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    v-model="privateKey"
                                    min="1"
                                    step="1"
                                    id="buy-private-key"
                                    :class="{'is-invalid':privateKeyInvalid}"
                                    @keyup.enter="buy"
                                />
                            </div>
                        </template>
                        <template v-else>
                            <p>You have successfully placed the order!</p>
                        </template>
                    </div>
                    <div class="modal-footer" v-if="!showBuySuccess">
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="buy"
                            :disabled="buying"
                        >{{buying?'Buying...':'Buy'}}</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    </div>
                    <div class="modal-footer" v-else>
                        <button type="button" class="btn btn-primary" @click="onBuyDialogClose">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="modal fade"
            id="donate-dialog"
            tabindex="-1"
            role="dialog"
            aria-labelledby="donate-dialog-header"
            aria-hidden="true"
        >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5
                            class="modal-title"
                            id="donate-dialog-header"
                        >Donate to {{selectedPoorUser?selectedPoorUser.name:''}}</h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            ref="donateCloseButton"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <template v-if="!showDonateSuccess">
                            <div class="form-group mt-3">
                                <label for="donate-amout-input">How much do you want to donate?</label>
                                <input
                                    class="form-control"
                                    type="number"
                                    v-model="donateAmount"
                                    min="1"
                                    step="1"
                                    id="donate-amout-input"
                                    :class="{'is-invalid':donateAmountInvalid||notEnough}"
                                    @keyup.enter="donate"
                                />
                                <div
                                    class="invalid-feedback"
                                    v-show="notEnough"
                                >Insufficient balance or transaction failure.</div>
                            </div>
                            <div class="form-group">
                                <label
                                    for="donate-private-key"
                                >Your private key for unlocking Ethereum account</label>
                                <input
                                    class="form-control"
                                    type="text"
                                    v-model="privateKey"
                                    min="1"
                                    step="1"
                                    id="donate-private-key"
                                    :class="{'is-invalid':privateKeyInvalid}"
                                    @keyup.enter="donate"
                                />
                            </div>
                        </template>
                        <template v-else>
                            <p>Thanks for your donation!</p>
                        </template>
                    </div>
                    <div class="modal-footer" v-if="!showDonateSuccess">
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="donate"
                            :disabled="donating"
                        >{{donating?'Donating...':'Donate'}}</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    </div>
                    <div class="modal-footer" v-else>
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="onDonateDialogClose"
                        >OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="loading" v-if="!user">Loading user data...</div>
        <template v-else>
            <div id="head" class="row align-items-center">
                <div id="user-info" class="col">
                    <div class="user-name">{{user.name}}</div>
                    <div class="user-balance">
                        Balance:
                        <span>{{refreshingBalance?'Refreshing...':`$${user.balance}`}}</span>
                    </div>
                    <a href="#" @click.prevent="refreshBalance">Refresh balance</a>
                    <a href="#" @click.prevent="signOut">Sign out</a>
                </div>
                <div id="user-story" class="col-8" v-if="user.type===USER_TYPE.POOR">
                    <div>
                        <small>My story:</small>
                        <p class="m-0">{{user.story}}</p>
                    </div>
                </div>
            </div>
            <div id="poor" class="row" v-if="user.type===USER_TYPE.POOR">
                <div id="who-helped-me" class="col">
                    <h3 class="mb-3 p-2">Who helped me</h3>
                    <div v-if="loadingWhoHelpedMe" class="mb-3">Querying data...</div>
                    <div v-else>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="whoHelpedMeList.length===0">
                                    <td colspan="3">No one helped you yet</td>
                                </tr>
                                <tr v-for="info in whoHelpedMeList">
                                    <td>{{info.name}}</td>
                                    <td>{{info.balance}}</td>
                                    <td>{{info.date.toString()}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        @click="loadWhoHelpedMe"
                        :disabled="loadingWhoHelpedMe"
                    >{{loadingWhoHelpedMe?'Refreshing...':'Refresh'}}</button>
                </div>
                <div id="buy-services" class="col">
                    <h3 class="mb-3 p-2">Available services</h3>
                    <div v-if="loadingServiceProviders" class="mb-3">Querying data...</div>
                    <div v-else>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="serviceProvider in serviceProviderList">
                                    <td>{{serviceProvider.name}}</td>
                                    <td>{{serviceProvider.detail}}</td>
                                    <td>{{serviceProvider.price}}</td>
                                    <td>
                                        <a
                                            href="#"
                                            @click.prevent="selectedServiceProvider=serviceProvider;$refs.showBuyDialogBtn.click()"
                                        >Buy</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            type="button"
                            class="btn btn-primary hide"
                            data-toggle="modal"
                            data-target="#buy-service-dialog"
                            ref="showBuyDialogBtn"
                        >Launch demo modal</button>
                    </div>
                </div>
            </div>
            <div id="rich" class="row mt-3" v-else>
                <div id="donate" class="col">
                    <h3 class="mb-3 p-2">Donate</h3>
                    <div v-if="loadingPoorUserList" class="mb-3">Loading...</div>
                    <div v-else>
                        <table class="table table-hover">
                            <tbody>
                                <tr v-for="user in poorUserList">
                                    <td>{{user.name}}</td>
                                    <td>{{user.story}}</td>
                                    <td>
                                        <a
                                            href="#"
                                            @click.prevent="selectedPoorUser=user;$refs.showDonateDialogBtn.click()"
                                        >Donate</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            type="button"
                            class="btn btn-primary hide"
                            data-toggle="modal"
                            data-target="#donate-dialog"
                            ref="showDonateDialogBtn"
                        >Launch demo modal</button>
                    </div>
                </div>
                <div id="my-donation" class="col">
                    <h3 class="mb-3 p-2">My donation</h3>
                    <div v-if="loadingDonationHistory" class="mb-3">Loading...</div>
                    <div v-else>
                        <table class="table table-hover">
                            <tbody>
                                <template v-for="donation in donationHistoryList">
                                    <tr>
                                        <td>{{donation.to}}</td>
                                        <td>${{donation.amount}}</td>
                                        <td>{{donation.date.toString()}}</td>
                                        <td>
                                            <a
                                                href="#"
                                                @click.prevent="showSpent"
                                            >How the money is spent?</a>
                                        </td>
                                    </tr>
                                    <tr class="hide">
                                        <td colspan="4">
                                            <table class="table table-sm table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Service name</th>
                                                        <th scope="col">Amount</th>
                                                        <th scope="col">Total prices</th>
                                                        <th scope="col">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="item in donation.spent">
                                                        <td id="data1">{{item.name}}</td>
                                                        <td>{{item.amount}}</td>
                                                        <td>{{item.total}}</td>
                                                        <td>{{item.date.toString()}}</td>
                                                    </tr>
                                                    <tr v-if="donation.spent.length===0">
                                                        <td
                                                            colspan="4"
                                                        >The money hasn't been spent yet</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </template>
                                <tr v-if="donationHistoryList.length===0">
                                    <td colspan="4">You haven't made any donation yet.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        @click="loadDonationHistory"
                        :disabled="loadingDonationHistory"
                    >{{loadingDonationHistory?'Refreshing...':'Refresh'}}</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
const apiPath = "api";
type SomeoneHelpedMeInfo = {
    name: string;
    data: Date;
    balance: number;
};
type ServiceProvider = {
    name: string;
    id: number;
    price: number;
    detail: string;
    publicKey: string;
};
var count =0;
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Axios from "axios";
import { User, USER_TYPE } from "./classes/User";
import { DonationHistory } from "./classes/Interfaces";
@Component
export default class UserApp extends Vue {
    $refs!: {
        showBuyDialogBtn: HTMLButtonElement;
        buyCloseButton: HTMLButtonElement;
        donateCloseButton: HTMLButtonElement;
        showDonateDialogBtn: HTMLButtonElement;
    };
    USER_TYPE: typeof USER_TYPE = USER_TYPE;
    user: User | null = null;
    loadingWhoHelpedMe: boolean = false;
    loadingServiceProviders: boolean = false;
    buying: boolean = false;
    refreshingBalance: boolean = false;
    loadingPoorUserList: boolean = false;
    donating: boolean = false;
    loadingDonationHistory: boolean = false;
    whoHelpedMeList: SomeoneHelpedMeInfo[] = [];
    serviceProviderList: ServiceProvider[] = [];
    selectedServiceProvider: ServiceProvider | null = null;
    selectedPoorUser: User | null = null;
    buyAmount: string = "1";
    privateKey: string = "";
    showBuySuccess: boolean = false;
    showDonateSuccess: boolean = false;
    poorUserList: User[] = [];
    donateAmount: string = "100";
    donationHistoryList: DonationHistory[] = [];
    notEnough: boolean = false;

    signOut() {
        Axios({
            method: "get",
            url: `${apiPath}/logoff`
        }).then(value => {
            location.reload();
        });
    }

    onBuyDialogClose() {
        this.$refs.buyCloseButton.click();
        this.buyAmount = "1";
        this.privateKey = "";
        this.refreshBalance();
        setTimeout(() => {
            this.showBuySuccess = false;
        }, 500);
    }

    onDonateDialogClose() {
        this.$refs.donateCloseButton.click();
        this.donateAmount = "100";
        this.privateKey = "";
        this.refreshBalance();
        this.loadDonationHistory();
        setTimeout(() => {
            this.showDonateSuccess = false;
        }, 500);
    }

    refreshBalance() {
        this.refreshingBalance = true;
        Axios({
            method: "get",
            url: `${apiPath}/user`
        })
            .then(value => {
                (this.user as User).balance = value.data.balance;
            })
            .finally(() => {
                this.refreshingBalance = false;
            });
    }

    donate() {
        if (
            !this.donateAmountInvalid &&
            this.selectedPoorUser &&
            !this.privateKeyInvalid
        ) {
            this.donating = true;
            this.notEnough = false;
            Axios({
                method: "post",
                url: `${apiPath}/donate`,
                data: {
                    userId: this.selectedPoorUser.id,
                    amount: Number(this.donateAmount),
                    privateKey: this.privateKey
                }
            })
                .then(value => {
                    this.showDonateSuccess = true;
                })
                .catch(e => {
                    this.notEnough = true;
                    setTimeout(() => {
                        this.notEnough = false;
                    }, 2000);
                })
                .finally(() => {
                    this.donating = false;
                });
        }
    }

    buy() {
        if (
            !this.buyAmountInvalid &&
            this.selectedServiceProvider &&
            !this.privateKeyInvalid
        ) {
            this.buying = true;
            this.notEnough = false;
            Axios({
                method: "post",
                url: `${apiPath}/buyService`,
                data: {
                    serviceId: this.selectedServiceProvider.id,
                    amount: Number(this.buyAmount),
                    privateKey: this.privateKey
                }
            })
                .then(value => {
                    this.showBuySuccess = true;
                })
                .catch(e => {
                    this.notEnough = true;
                    setTimeout(() => {
                        this.notEnough = false;
                    }, 2000);
                })
                .finally(() => {
                    this.buying = false;
                });
        }
    }

    get buyAmountInvalid(): boolean {
        return (
            this.buyAmount.startsWith("-") ||
            this.buyAmount.indexOf(".") > -1 ||
            this.buyAmount.trim() === "0" ||
            this.buyAmount.trim().length === 0
        );
    }

    get donateAmountInvalid(): boolean {
        return (
            this.donateAmount.startsWith("-") ||
            this.donateAmount.trim().length === 0
        );
    }

    get privateKeyInvalid(): boolean {
        return this.privateKey.trim().length === 0;
    }

    loadWhoHelpedMe() {
        this.loadingWhoHelpedMe = true;
        Axios({
            method: "get",
            url: `${apiPath}/whohelpedme`
        })
            .then(value => {
                this.whoHelpedMeList = value.data;
            })
            .finally(() => {
                this.loadingWhoHelpedMe = false;
            });
    }

    loadServieProviders() {
        this.loadingServiceProviders = true;
        Axios({
            method: "get",
            url: `${apiPath}/getServiceProviderList`
        })
            .then(value => {
                this.serviceProviderList = value.data;
            })
            .finally(() => {
                this.loadingServiceProviders = false;
            });
    }

    loadPoorUserList() {
        this.loadingPoorUserList = true;
        Axios({
            method: "get",
            url: `${apiPath}/getPoorUserList`
        })
            .then(value => {
                this.poorUserList = value.data;
            })
            .finally(() => {
                this.loadingPoorUserList = false;
            });
    }

    loadDonationHistory() {
        this.loadingDonationHistory = true;
        Axios({
            method: "post",
            // url: `fakeapi/WhereIsMyMoney`,
            url: `api/WhereIsMyMoney`,
            data: {
                    count:count++,
                }
        })
            .then(value => {
                this.donationHistoryList = value.data;
            })
            .finally(() => {
                this.loadingDonationHistory = false;
            });
    }

    showSpent(e: MouseEvent) {
        let a = e.target as HTMLAnchorElement;
        a.parentElement!.parentElement!.nextElementSibling!.classList.toggle(
            "hide"
        );
    }

    mounted() {
        console.log("Mounted", this);
        Axios({
            method: "get",
            url: `${apiPath}/user`
        })
            .then(value => {
                this.user = value.data as User;
                if (this.user.type === USER_TYPE.POOR) {
                    this.initPoorUser();
                } else {
                    this.initRichUser();
                }
            })
            .catch(() => {
                location.reload();
            });
    }

    initPoorUser() {
        this.loadWhoHelpedMe();
        this.loadServieProviders();
    }

    initRichUser() {
        this.loadPoorUserList();
        this.loadDonationHistory();
    }
}
</script>
<style lang="less">
@import "./styles/common.less";
#app {
    width: 1200px;
    margin: 0 auto;
}
#loading {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 50px;
    position: absolute;
    left: 0;
    top: 0;
    background: #eee;
    vertical-align: middle;
    line-height: calc(100vh);
}

#user-info {
    .user-name {
        font-size: 24px;
        font-weight: bold;
    }
    .user-balance {
        color: #777;
        span {
            font-size: 20px;
        }
    }
    > a {
        font-size: 12px;
    }
}

#user-story {
    > div {
        padding: 1.25rem;
        margin-top: 1.25rem;
        margin-bottom: 1.25rem;
        border: 1px solid #eee;
        border-left-width: 0.25rem;
        border-radius: 0.25rem;
        border-left-color: #5bc0de;
    }
}

h3 {
    border-left: 0.25rem solid #f0ad4e;
    font-size: 20px;
    border-radius: 0.25rem;
}
</style>