# Credential files #

The server does have some API integrations to fetch more information for each video. Some integrations require credentials to authorize the requests. In case credentials are needed you need to create the corresponding credentials JSON and place it in this directory. There are no default credential files since they are on .gitignore.

Find a list of how to obtain the key, the correct file name and the JSON format for each provider below.

## Currently supported providers and file format ##

### YouTube ###

Get credentials: https://console.developers.google.com/apis/credentials

**youtube.json**

```
{
    "key": "yourOAuthAPIServerKeyGoesHere"
}
```
