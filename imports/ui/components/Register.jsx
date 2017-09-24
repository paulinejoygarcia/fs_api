import React, { Component } from 'react';
import { UsersRegister } from '../../api/users';
import '../stylesheets/login.css';
export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
        };
    }
    componentDidMount(){
        this.generatePin();
    }
    generatePin(){
        this.pin.value = Math.random().toString(36).substring(6);
    }
    onSubmit(e) {
        e.preventDefault();
        let email = this.email.value.trim(),
            password = this.password1.value.trim(),
            first = this.first.value.trim(),
            last = this.last.value.trim();
            pin = this.pin.value.trim();
        let country = this.country.value;
        let timezone = this.timezone.value;
        let currency = this.currency.value;
        if (password.length < 6)
            return Bert.alert('Password must be more than 5 characters long!', 'danger', 'growl-top-right');
        if (password !== this.password2.value.trim())
            return Bert.alert('Password must be matched!', 'danger', 'growl-top-right');
        if (email.length < 1 || first.length < 1 || last.length < 1)
            return Bert.alert('All fields are required!', 'danger', 'growl-top-right');
        this.setState({ saving: true });
        Meteor.call(UsersRegister, { email, password, first, last, pin, country, timezone, currency}, (err) => {
            if (err)
                Bert.alert(err.reason, 'danger', 'growl-top-right');
            else {
                Bert.alert('New user registered! Redirecting to login page...', 'success', 'growl-top-right');
                this.email.value
                    = this.password1.value
                    = this.password2.value
                    = this.first.value
                    = this.last.value
                    = this.pin.value
                    = "";
                this.country.value = 1;
                this.timezone.value = 1;
                this.currency.value = 1;
                setTimeout(function () {
                    window.location.href = "/";
                }, 2000);
            }
            this.setState({ saving: false });
        });
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-6 col-md-4 col-md-offset-4 fz-lg">
                        <h1 className="text-center login-title mt20 mb10">Register
                            to {this.props.title || "UConnectedIt"}</h1>
                        <div className="border-t-1 account-wall">
                            <form onSubmit={this.onSubmit.bind(this)}>
                                <div className="form-group col-md-6">
                                    <input type="text" ref={(e) => {
                                        this.first = e;
                                    }} className="form-control" name="first" placeholder="First Name"/>
                                </div>

                                <div className="form-group col-md-6">
                                    <input type="text" ref={(e) => {
                                        this.last = e;
                                    }} className="form-control" name="last" placeholder="Last Name"/>
                                </div>

                                <div className="form-group col-md-6">
                                    <input type="password" ref={(e) => {
                                        this.password1 = e;
                                    }} className="form-control" name="password1" placeholder="Password"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <input type="password" ref={(e) => {
                                        this.password2 = e;
                                    }} className="form-control" name="password2" placeholder="Confirm Password"/>
                                </div>

                                <div className="form-group col-md-12">
                                    <input type="email" ref={(e) => {
                                        this.email = e;
                                    }} className="form-control" name="email" placeholder="Email Address"/>
                                </div>

                                <div className="form-group col-md-6">
                                    <input type="text" ref={(e) => {
                                        this.pin = e;
                                    }} className="form-control" name="pin" placeholder="Pin" readOnly/>
                                </div>

                                <div className="form-group col-md-6">
                                    <button type="button" className="form-control btn btn-lg btn-default" onClick={this.generatePin.bind(this)}>Generate Pin</button>
                                </div>

                                <div className="form-group col-md-6">
                                    <select ref={(e)=>{this.country = e;}} className="form-control" style={{height:"38px"}}>
                                        <option value="2">Alaska</option>
                                        <option value="3">Albania</option>
                                        <option value="4">Algeria</option>
                                        <option value="5">AmericanSamoa</option>
                                        <option value="6">Andorra</option>
                                        <option value="7">Angola</option>
                                        <option value="8">Antarctica</option>
                                        <option value="9">Argentina</option>
                                        <option value="10">Armenia</option>
                                        <option value="11">Aruba</option>
                                        <option value="12">Ascension</option>
                                        <option value="13">Australia</option>
                                        <option value="14">Austria</option>
                                        <option value="15">Azerbaijan</option>
                                        <option value="16">Bahrain</option>
                                        <option value="17">Bangladesh</option>
                                        <option value="18">Belarus</option>
                                        <option value="19">Belgium</option>
                                        <option value="20">Belize</option>
                                        <option value="21">Benin</option>
                                        <option value="22">Bhutan</option>
                                        <option value="23">Bolivia</option>
                                        <option value="24">Bosnia &amp; Herzegovina</option>
                                        <option value="25">Botswana</option>
                                        <option value="26">Brazil</option>
                                        <option value="27">Brunei Darussalam</option>
                                        <option value="28">Bulgaria</option>
                                        <option value="29">Burkina Faso</option>
                                        <option value="30">Burundi</option>
                                        <option value="31">Cambodia</option>
                                        <option value="32">Cameroon</option>
                                        <option value="33">Canada</option>
                                        <option value="34">Cape Verde Islands</option>
                                        <option value="35">Central African Republic</option>
                                        <option value="36">Chad</option>
                                        <option value="37">Chile</option>
                                        <option value="38">China</option>
                                        <option value="39">Colombia</option>
                                        <option value="40">Comoros</option>
                                        <option value="41">Congo</option>
                                        <option value="42">Cook Islands</option>
                                        <option value="43">Costa Rica</option>
                                        <option value="44">Croatia</option>
                                        <option value="45">Cuba</option>
                                        <option value="46">Cuba Guantanamo Bay</option>
                                        <option value="47">Cyprus</option>
                                        <option value="48">Czech Republic</option>
                                        <option value="49">Denmark</option>
                                        <option value="50">Diego Garcia</option>
                                        <option value="51">Djibouti</option>
                                        <option value="52">Dominican Republic</option>
                                        <option value="53">East Timor</option>
                                        <option value="54">Ecuador</option>
                                        <option value="55">Egypt</option>
                                        <option value="56">El Salvador</option>
                                        <option value="57">Equatorial Guinea</option>
                                        <option value="58">Eritrea</option>
                                        <option value="59">Estonia</option>
                                        <option value="60">Ethiopia</option>
                                        <option value="61">Faroe Islands</option>
                                        <option value="62">Fiji Islands</option>
                                        <option value="63">Finland</option>
                                        <option value="64">France</option>
                                        <option value="65">French Guiana</option>
                                        <option value="66">French Polynesia</option>
                                        <option value="67">Gabonese Republic</option>
                                        <option value="68">Gambia</option>
                                        <option value="69">Georgia</option>
                                        <option value="70">Germany</option>
                                        <option value="71">Ghana</option>
                                        <option value="72">Gibraltar</option>
                                        <option value="73">Greece</option>
                                        <option value="74">Greenland</option>
                                        <option value="75">Guadeloupe</option>
                                        <option value="76">Guam</option>
                                        <option value="77">Guatemala</option>
                                        <option value="78">Guinea</option>
                                        <option value="79">Guyana</option>
                                        <option value="80">Haiti</option>
                                        <option value="81">Honduras</option>
                                        <option value="82">Hong Kong</option>
                                        <option value="83">Hungary</option>
                                        <option value="84">Iceland</option>
                                        <option value="85">India</option>
                                        <option value="86">Indonesia</option>
                                        <option value="87">Iran</option>
                                        <option value="88">Iraq</option>
                                        <option value="89">Ireland</option>
                                        <option value="90">Israel</option>
                                        <option value="91">Italy</option>
                                        <option value="92">Jamaica</option>
                                        <option value="93">Japan</option>
                                        <option value="94">Jordan</option>
                                        <option value="95">Kazakstan</option>
                                        <option value="96">Kenya</option>
                                        <option value="97">Kiribati</option>
                                        <option value="98">Kuwait</option>
                                        <option value="99">Kyrgyz Republic</option>
                                        <option value="100">Laos</option>
                                        <option value="101">Latvia</option>
                                        <option value="102">Lebanon</option>
                                        <option value="103">Lesotho</option>
                                        <option value="104">Liberia</option>
                                        <option value="105">Libya</option>
                                        <option value="106">Liechtenstein</option>
                                        <option value="107">Lithuania</option>
                                        <option value="108">Luxembourg</option>
                                        <option value="109">Macao</option>
                                        <option value="110">Madagascar</option>
                                        <option value="111">Malawi</option>
                                        <option value="112">Malaysia</option>
                                        <option value="113">Maldives</option>
                                        <option value="114">Mali Republic</option>
                                        <option value="115">Malta</option>
                                        <option value="116">Marshall Islands</option>
                                        <option value="117">Martinique</option>
                                        <option value="118">Mauritania</option>
                                        <option value="119">Mauritius</option>
                                        <option value="120">MayotteIsland</option>
                                        <option value="121">Mexico</option>
                                        <option value="122">Midway Islands</option>
                                        <option value="123">Moldova</option>
                                        <option value="124">Monaco</option>
                                        <option value="125">Mongolia</option>
                                        <option value="126">Morocco</option>
                                        <option value="127">Mozambique</option>
                                        <option value="128">Myanmar</option>
                                        <option value="129">Namibia</option>
                                        <option value="130">Nauru</option>
                                        <option value="131">Nepal</option>
                                        <option value="132">Netherlands</option>
                                        <option value="133">Netherlands Antilles</option>
                                        <option value="134">New Caledonia</option>
                                        <option value="135">New Zealand</option>
                                        <option value="136">Nicaragua</option>
                                        <option value="137">Niger</option>
                                        <option value="138">Nigeria</option>
                                        <option value="139">Niue</option>
                                        <option value="140">Norfolk Island</option>
                                        <option value="141">North Korea</option>
                                        <option value="142">Norway</option>
                                        <option value="143">Oman</option>
                                        <option value="144">Pakistan</option>
                                        <option value="145">Palau</option>
                                        <option value="146">Palestinian Settlements</option>
                                        <option value="147">Panama</option>
                                        <option value="148">PapuaNew Guinea</option>
                                        <option value="149">Paraguay</option>
                                        <option value="150">Peru</option>
                                        <option value="151">Philippines</option>
                                        <option value="152">Poland</option>
                                        <option value="153">Portugal</option>
                                        <option value="154">Puerto Rico</option>
                                        <option value="155">Qatar</option>
                                        <option value="156">RÃ©unionIsland</option>
                                        <option value="157">Romania</option>
                                        <option value="158">Russia</option>
                                        <option value="159">Rwandese Republic</option>
                                        <option value="160">San Marino</option>
                                        <option value="161">Saudi Arabia</option>
                                        <option value="162">SÃ£o TomÃ© and Principe</option>
                                        <option value="163">Senegal </option>
                                        <option value="164">Serbia and Montenegro</option>
                                        <option value="165">Seychelles Republic</option>
                                        <option value="166">Sierra Leone</option>
                                        <option value="167">Singapore</option>
                                        <option value="168">Slovak Republic</option>
                                        <option value="169">Slovenia</option>
                                        <option value="170">Solomon Islands</option>
                                        <option value="171">Somali Democratic Republic</option>
                                        <option value="172">South Africa</option>
                                        <option value="173">South Korea</option>
                                        <option value="174">Spain</option>
                                        <option value="175">Sri Lanka</option>
                                        <option value="176">St Kitts - Nevis</option>
                                        <option value="177">St. Helena</option>
                                        <option value="178">St. Lucia</option>
                                        <option value="179">St. Pierre &amp; Miquelon</option>
                                        <option value="180">St. Vincent &amp; Grenadines</option>
                                        <option value="181">Sudan</option>
                                        <option value="182">Suriname</option>
                                        <option value="183">Swaziland</option>
                                        <option value="184">Sweden</option>
                                        <option value="185">Switzerland</option>
                                        <option value="186">Syria</option>
                                        <option value="187">Taiwan</option>
                                        <option value="188">Tajikistan</option>
                                        <option value="189">Tanzania</option>
                                        <option value="190">Thailand</option>
                                        <option value="191">Togolese Republic</option>
                                        <option value="192">Tokelau</option>
                                        <option value="193">Tonga Islands</option>
                                        <option value="194">Trinidad &amp; Tobago</option>
                                        <option value="195">Tunisia</option>
                                        <option value="196">Turkey</option>
                                        <option value="197">Turkmenistan</option>
                                        <option value="198">Tuvalu</option>
                                        <option value="199">Uganda</option>
                                        <option value="200">Ukraine</option>
                                        <option value="201">United Arab Emirates</option>
                                        <option value="202">United Kingdom</option>
                                        <option value="203">United States of America</option>
                                        <option value="204">Uruguay</option>
                                        <option value="205">Uzbekistan</option>
                                        <option value="206">Vanuatu</option>
                                        <option value="207">Venezuela</option>
                                        <option value="208">Vietnam</option>
                                        <option value="209">Wake Island</option>
                                        <option value="210">Wallisand Futuna Islands</option>
                                        <option value="211">Western Samoa</option>
                                        <option value="212">Yemen</option>
                                        <option value="213">Zambia</option>
                                        <option value="214">Zimbabwe</option>
                                        <option value="215">po[</option>
                                    </select>
                                </div>

                                <div className="form-group col-md-6">
                                    <select ref={(e)=>{this.currency = e;}} className="form-control" style={{height:"38px"}}>
                                        <option value="1">Albanian Lek (ALL)</option>
                                        <option value="2">Algerian Dinar (DZD)</option>
                                        <option value="3">Aluminium Ounces (XAL)</option>
                                        <option value="4">Argentine Peso (ARS)</option>
                                        <option value="5">Aruba Florin (AWG)</option>
                                        <option value="6">Australian Dollar (AUD)</option>
                                        <option value="7">Bahamian Dollar (BSD)</option>
                                        <option value="8">Bahraini Dinar (BHD)</option>
                                        <option value="9">Bangladesh Taka (BDT)</option>
                                        <option value="10">Barbados Dollar (BBD)</option>
                                        <option value="11">Belarus Ruble (BYR)</option>
                                        <option value="12">Belize Dollar (BZD)</option>
                                        <option value="13">Bermuda Dollar (BMD)</option>
                                        <option value="14">Bhutan Ngultrum (BTN)</option>
                                        <option value="15">Bolivian Boliviano (BOB)</option>
                                        <option value="16">Brazilian Real (BRL)</option>
                                        <option value="17">British Pound (GBP)</option>
                                        <option value="18">Brunei Dollar (BND)</option>
                                        <option value="19">Bulgarian Lev (BGN)</option>
                                        <option value="20">Burundi Franc (BIF)</option>
                                        <option value="21">Cambodia Riel (KHR)</option>
                                        <option value="22">Canadian Dollar (CAD)</option>
                                        <option value="23">Cayman Islands Dollar (KYD)</option>
                                        <option value="24">CFA Franc (BCEAO) (XOF)</option>
                                        <option value="25">CFA Franc (BEAC) (XAF)</option>
                                        <option value="26">Chilean Peso (CLP)</option>
                                        <option value="27">Chinese Yuan (CNY)</option>
                                        <option value="28">Colombian Peso (COP)</option>
                                        <option value="29">Comoros Franc (KMF)</option>
                                        <option value="30">Copper Ounces (XCP)</option>
                                        <option value="31">Costa Rica Colon (CRC)</option>
                                        <option value="32">Croatian Kuna (HRK)</option>
                                        <option value="33">Cuban Peso (CUP)</option>
                                        <option value="34">Cyprus Pound (CYP)</option>
                                        <option value="35">Czech Koruna (CZK)</option>
                                        <option value="36">Danish Krone (DKK)</option>
                                        <option value="37">Dijibouti Franc (DJF)</option>
                                        <option value="38">Dominican Peso (DOP)</option>
                                        <option value="39">East Caribbean Dollar (XCD)</option>
                                        <option value="40">Ecuador Sucre (ECS)</option>
                                        <option value="41">Egyptian Pound (EGP)</option>
                                        <option value="42">El Salvador Colon (SVC)</option>
                                        <option value="43">Eritrea Nakfa (ERN)</option>
                                        <option value="44">Estonian Kroon (EEK)</option>
                                        <option value="45">Ethiopian Birr (ETB)</option>
                                        <option value="46">Euro (EUR)</option>
                                        <option value="47">Falkland Islands Pound (FKP)</option>
                                        <option value="48">Gambian Dalasi (GMD)</option>
                                        <option value="49">Ghanian Cedi (GHC)</option>
                                        <option value="50">Gibraltar Pound (GIP)</option>
                                        <option value="51">Gold Ounces (XAU)</option>
                                        <option value="52">Guatemala Quetzal (GTQ)</option>
                                        <option value="53">Guinea Franc (GNF)</option>
                                        <option value="54">Haiti Gourde (HTG)</option>
                                        <option value="55">Honduras Lempira (HNL)</option>
                                        <option value="56">Hong Kong Dollar (HKD)</option>
                                        <option value="57">Hungarian ForINT (HUF)</option>
                                        <option value="58">Iceland Krona (ISK)</option>
                                        <option value="59">Indian Rupee (INR)</option>
                                        <option value="60">Indonesian Rupiah (IDR)</option>
                                        <option value="61">Iran Rial (IRR)</option>
                                        <option value="62">Israeli Shekel (ILS)</option>
                                        <option value="63">Jamaican Dollar (JMD)</option>
                                        <option value="64">Japanese Yen (JPY)</option>
                                        <option value="65">Jordanian Dinar (JOD)</option>
                                        <option value="66">Kazakhstan Tenge (KZT)</option>
                                        <option value="67">Kenyan Shilling (KES)</option>
                                        <option value="68">Korean Won (KRW)</option>
                                        <option value="69">Kuwaiti Dinar (KWD)</option>
                                        <option value="70">Lao Kip (LAK)</option>
                                        <option value="71">Latvian Lat (LVL)</option>
                                        <option value="72">Lebanese Pound (LBP)</option>
                                        <option value="73">Lesotho Loti (LSL)</option>
                                        <option value="74">Libyan Dinar (LYD)</option>
                                        <option value="75">Lithuanian Lita (LTL)</option>
                                        <option value="76">Macau Pataca (MOP)</option>
                                        <option value="77">Macedonian Denar (MKD)</option>
                                        <option value="78">Malagasy Franc (MGF)</option>
                                        <option value="79">Malawi Kwacha (MWK)</option>
                                        <option value="80">Malaysian Ringgit (MYR)</option>
                                        <option value="81">Maldives Rufiyaa (MVR)</option>
                                        <option value="82">Maltese Lira (MTL)</option>
                                        <option value="83">Mauritania Ougulya (MRO)</option>
                                        <option value="84">Mauritius Rupee (MUR)</option>
                                        <option value="85">Mexican Peso (MXN)</option>
                                        <option value="86">Moldovan Leu (MDL)</option>
                                        <option value="87">Mongolian Tugrik (MNT)</option>
                                        <option value="88">Moroccan Dirham (MAD)</option>
                                        <option value="89">Mozambique Metical (MZM)</option>
                                        <option value="90">Namibian Dollar (NAD)</option>
                                        <option value="91">Nepalese Rupee (NPR)</option>
                                        <option value="92">Neth Antilles Guilder (ANG)</option>
                                        <option value="93">New Turkish Lira (TRY)</option>
                                        <option value="94">New Zealand Dollar (NZD)</option>
                                        <option value="95">Nicaragua Cordoba (NIO)</option>
                                        <option value="96">Nigerian Naira (NGN)</option>
                                        <option value="97">Norwegian Krone (NOK)</option>
                                        <option value="98">Omani Rial (OMR)</option>
                                        <option value="99">Pacific Franc (XPF)</option>
                                        <option value="100">Pakistani Rupee (PKR)</option>
                                        <option value="101">Palladium Ounces (XPD)</option>
                                        <option value="102">Panama Balboa (PAB)</option>
                                        <option value="103">Papua New Guinea Kina (PGK)</option>
                                        <option value="104">Paraguayan Guarani (PYG)</option>
                                        <option value="105">Peruvian Nuevo Sol (PEN)</option>
                                        <option value="106">Philippine Peso (PHP)</option>
                                        <option value="107">Platinum Ounces (XPT)</option>
                                        <option value="108">Polish Zloty (PLN)</option>
                                        <option value="109">Qatar Rial (QAR)</option>
                                        <option value="110">Romanian Leu (ROL)</option>
                                        <option value="111">Romanian New Leu (RON)</option>
                                        <option value="112">Russian Rouble (RUB)</option>
                                        <option value="113">Rwanda Franc (RWF)</option>
                                        <option value="114">Samoa Tala (WST)</option>
                                        <option value="115">Sao Tome Dobra (STD)</option>
                                        <option value="116">Saudi Arabian Riyal (SAR)</option>
                                        <option value="117">Seychelles Rupee (SCR)</option>
                                        <option value="118">Sierra Leone Leone (SLL)</option>
                                        <option value="119">Silver Ounces (XAG)</option>
                                        <option value="120">Singapore Dollar (SGD)</option>
                                        <option value="121">Slovak Koruna (SKK)</option>
                                        <option value="122">Slovenian Tolar (SIT)</option>
                                        <option value="123">Somali Shilling (SOS)</option>
                                        <option value="124">South African Rand (ZAR)</option>
                                        <option value="125">Sri Lanka Rupee (LKR)</option>
                                        <option value="126">St Helena Pound (SHP)</option>
                                        <option value="127">Sudanese Dinar (SDD)</option>
                                        <option value="128">Surinam Guilder (SRG)</option>
                                        <option value="129">Swaziland Lilageni (SZL)</option>
                                        <option value="130">Swedish Krona (SEK)</option>
                                        <option value="131">Swiss Franc (CHF)</option>
                                        <option value="132">Syrian Pound (SYP)</option>
                                        <option value="133">Taiwan Dollar (TWD)</option>
                                        <option value="134">Tanzanian Shilling (TZS)</option>
                                        <option value="135">Thai Baht (THB)</option>
                                        <option value="136">Tonga Paanga (TOP)</option>
                                        <option value="137">Trinidad&amp;Tobago Dollar (TTD)</option>
                                        <option value="138">Tunisian Dinar (TND)</option>
                                        <option value="139">U.S. Dollar (USD)</option>
                                        <option value="140">UAE Dirham (AED)</option>
                                        <option value="141">Ugandan Shilling (UGX)</option>
                                        <option value="142">Ukraine Hryvnia (UAH)</option>
                                        <option value="143">Uruguayan New Peso (UYU)</option>
                                        <option value="144">Vanuatu Vatu (VUV)</option>
                                        <option value="145">Venezuelan Bolivar (VEB)</option>
                                        <option value="146">Vietnam Dong (VND)</option>
                                        <option value="147">Yemen Riyal (YER)</option>
                                        <option value="148">Zambian Kwacha (ZMK)</option>
                                        <option value="149">Zimbabwe Dollar (ZWD)</option>
                                        <option value="150">Guyana Dollar (GYD)</option>
                                        <option value="151">uioui (458)</option>
                                        <option value="152">g34y35hg 4h45h45 (h45)</option>
                                        <option value="153">45435 (453)</option>
                                        <option value="154">test (526)</option>
                                        <option value="155">test2 (34g)</option>
                                        <option value="156">fdg (fhd)</option>
                                        <option value="157">fdsdg (dfh)</option>
                                        <option value="159">test (tes)</option>
                                    </select>
                                </div>

                                <div className="form-group col-md-12">
                                    <select ref={(e)=>{this.timezone = e;}} className="form-control" style={{height:"38px"}}>
                                        <option value="1">(GMT-12:00) International Date Line West</option>
                                        <option value="2">(GMT-11:00) Midway Island, Samoa</option>
                                        <option value="3">(GMT-10:00) Hawaii</option>
                                        <option value="4">(GMT-09:00) Alaska</option>
                                        <option value="5">(GMT-08:00) Pacific Time (US &amp; Canada) Tijuana</option>
                                        <option value="6">(GMT-07:00) Arizona</option>
                                        <option value="7">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                                        <option value="8">(GMT-07:00) Mountain Time(US &amp; Canada)</option>
                                        <option value="9">(GMT-06:00) Central America</option>
                                        <option value="10">(GMT-06:00) Central Time (US &amp; Canada)</option>
                                        <option value="11">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                                        <option value="12">(GMT-06:00) Saskatchewan</option>
                                        <option value="13">(GMT-05:00) Bogota, Lima, Quito</option>
                                        <option value="14">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                                        <option value="15">(GMT-05:00) Indiana (East)</option>
                                        <option value="16">(GMT-04:00) Atlantic Time (Canada)</option>
                                        <option value="17">(GMT-04:00) Caracas, La Paz</option>
                                        <option value="18">(GMT-04:00) Santiago</option>
                                        <option value="19">(GMT-03:30) NewFoundland</option>
                                        <option value="20">(GMT-03:00) Brasillia</option>
                                        <option value="21">(GMT-03:00) Buenos Aires, Georgetown</option>
                                        <option value="22">(GMT-03:00) Greenland</option>
                                        <option value="23">(GMT-03:00) Mid-Atlantic</option>
                                        <option value="24">(GMT-01:00) Azores</option>
                                        <option value="25">(GMT-01:00) Cape Verd Is.</option>
                                        <option value="26">(GMT) Casablanca, Monrovia</option>
                                        <option value="27">(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon,  London</option>
                                        <option value="28">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                                        <option value="29">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                                        <option value="30">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                                        <option value="31">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
                                        <option value="32">(GMT+01:00) West Central Africa</option>
                                        <option value="33">(GMT+02:00) Athens, Istanbul, Minsk</option>
                                        <option value="34">(GMT+02:00) Bucharest</option>
                                        <option value="35">(GMT+02:00) Cairo</option>
                                        <option value="36">(GMT+02:00) Harare, Pretoria</option>
                                        <option value="37">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                                        <option value="38">(GMT+02:00) Jeruasalem</option>
                                        <option value="39">(GMT+03:00) Baghdad</option>
                                        <option value="40">(GMT+03:00) Kuwait, Riyadh</option>
                                        <option value="41">(GMT+03:00) Moscow, St.Petersburg, Volgograd</option>
                                        <option value="42">(GMT+03:00) Nairobi</option>
                                        <option value="43">(GMT+03:30) Tehran</option>
                                        <option value="44">(GMT+04:00) Abu Dhabi, Muscat</option>
                                        <option value="45">(GMT+04:00) Baku, Tbillisi, Yerevan</option>
                                        <option value="46">(GMT+04:30) Kabul</option>
                                        <option value="47">(GMT+05:00) Ekaterinburg</option>
                                        <option value="48">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
                                        <option value="49">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                        <option value="50">(GMT+05:45) Kathmandu</option>
                                        <option value="51">(GMT+06:00) Almaty, Novosibirsk</option>
                                        <option value="52">(GMT+06:00) Astana, Dhaka</option>
                                        <option value="53">(GMT+06:00) Sri Jayawardenepura</option>
                                        <option value="54">(GMT+06:30) Rangoon</option>
                                        <option value="55">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                                        <option value="56">(GMT+07:00) Krasnoyarsk</option>
                                        <option value="57">(GMT+08:00) Beijiing, Chongging, Hong Kong, Urumqi</option>
                                        <option value="58">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
                                        <option value="59">(GMT+08:00) Kuala Lumpur, Singapore</option>
                                        <option value="60">(GMT+08:00) Perth</option>
                                        <option value="61">(GMT+08:00) Taipei</option>
                                        <option value="62">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                                        <option value="63">(GMT+09:00) Seoul</option>
                                        <option value="64">(GMT+09:00) Yakutsk</option>
                                        <option value="65">(GMT+09:00) Adelaide</option>
                                        <option value="66">(GMT+09:30) Darwin</option>
                                        <option value="67">(GMT+10:00) Brisbane</option>
                                        <option value="68">(GMT+10:00) Canberra, Melbourne, Sydney</option>
                                        <option value="69">(GMT+10:00) Guam, Port Moresby</option>
                                        <option value="70">(GMT+10:00) Hobart</option>
                                        <option value="71">(GMT+10:00) Vladivostok</option>
                                        <option value="72">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
                                        <option value="73">(GMT+12:00) Auckland, Wellington</option>
                                        <option value="74">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                                        <option value="75">(GMT+13:00) Nuku alofa</option>
                                    </select>
                                </div>

                                <div className="m-4">
                                    <button disabled={this.state.saving} type="submit"
                                            className="btn btn-lg bg-red-500 text-white btn-block">
                                        {this.state.saving ?
                                            <i className="fa fa-spin fa-circle-o-notch"/> : "Create Account"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <a href="/" className="fz-lg text-center new-account">Sign In Account </a>
                    </div>
                </div>
            </div>
        );
    }
}