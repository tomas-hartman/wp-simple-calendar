# wp-simple-calendar

https://github.com/tomas-hartman/wp-simple-calendar/

Wordpress plugin made as a lightweight and straightforward calendar solution.

Inspired by discontinued Event List Calendar made by Ryan Fait, that I originally used for a school website project (www.skolahradecns.cz).

Unlike the older one, this calendar's rendering module is based on vanilla javascript and makes no use of jQuery.

There is a full one-way compatibility with events made with Event List Calendar which makes this calendar its possible replacement.

## Installation & how to work with

1. **install wordpress** 
1. **clone this repository** to your `wordpress/wp-content/plugins/` folder
2. **activate plugin** in `admin > Plugins`
3. *(recommended)* **deactivate/delete Event list calendar** (all should work fine, but there might be some incompatibility)
3. display calendar on your website using **shortcode** `[swp-mini-calendar]` (mini calendar) or `[swp-calendar-list]` (list of events)
4. **add new events** from `admin > Události`

> **Warning!** If you have previously used Event List Calendar, activation of Simple Wordpress Calendar automatically migrates all of it's data, so it can work with them. This is however one-way only proccess.

### Event settings
When you create a new event, it is obligatory to fill in its "Title" and "Date". It is optional to set "Time". 

**Possible events that can be created**:
- `Simple events` *(default)*
- `Multiple day events` *(by setting "End date")*
- `Repeating events` *(by setting "Repetition")*
- `Terminated repeating events` *(by setting "End date" and "Repetition")*

> It is known issue that (way less frequent) `Repeating multiple day` and `Terminated repeating multiple day` events cannot be created [#5](https://github.com/tomas-hartman/wp-simple-calendar/issues/5).

## Feedback, bugshooting and todos

There is a good deal of features those would need more work and some other issues and bugs. Some of them are well known, some of them will emerge with further usage. 

If you spot any bugs or have a feature proposition, please make an new issue at https://github.com/tomas-hartman/wp-simple-calendar/issues/.

This plugin currently do not offer any other languages than Czech and customary *continental* layout of weekdays (weeks starting on Monday). In addition, there is currently only one graphic theme of the calendar. These are some of the most desired features for possible future releases. 

## Compatibility

- Should work the best with modern desktop browsers.
- Should work pretty well with mobile devices but some changes will be going on, especially on UX side [#29](https://github.com/tomas-hartman/wp-simple-calendar/issues/29).

### Legacy browser support:
- IE11
- Firefox > 60
- Chrome > 69
- Safari > 11.1


# VUE

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
