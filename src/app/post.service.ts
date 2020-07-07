import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {PostModel} from "./post.model";
import {map, tap} from "rxjs/operators";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  error = new Subject<string>();
  requestSent = new Subject<boolean>();
  responseReceived = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(postData: { title: string, content: string }) {
    const postDat: PostModel = {title: postData.title, content: postData.content};
    this.http.post<{ name: string }>
    ('https://ng-complete-guide-f52d5.firebaseio.com/posts.json',
      postDat, {
        observe: "events"
      }).pipe(tap(event => {
      if (event.type === HttpEventType.Sent) {
        this.requestSent.next(true);
      } else if (event.type === HttpEventType.Response) {
        this.responseReceived.next(true);
      }
    }))
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts(): Observable<PostModel[]> {
    return this.http.get<{ [key: string]: PostModel }>
    ('https://ng-complete-guide-f52d5.firebaseio.com/posts.json', {
      headers: new HttpHeaders({
        'customized-header': 'hello'
      }),
      params: new HttpParams().set('print', 'pretty'),
      observe: "body",
      responseType: "json"
    })
      .pipe(map((responseData) => {
        const postsArray: PostModel[] = [];
        for (const key in responseData) {
          console.log('key is ' + key);
          if (responseData.hasOwnProperty(key)) {
            // the ... pulls out all the nested key value pairs of responseData
            console.log(responseData[key]);
            postsArray.push({id: key, ...responseData[key]});
          }
        }
        return postsArray;
      }));
  }

  deletePosts() {
    return this.http.delete('https://ng-complete-guide-f52d5.firebaseio.com/posts.json');
  }
}
